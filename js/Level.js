define(function(require) {

    var Group = require('zrender/Group');

    var NodeEntity = require('./NodeEntity');
    var EdgeEntity = require('./EdgeEntity');
    var Force = require('./Force');

    var notifier = require('qtek/core/mixin/notifier');
    var qtekUtil = require('qtek/core/util');

    var log = require('./log');
    var screenSize = require('./screenSize');

    var Level = function(graph, zr) {

        this.graph = graph;

        this.zr = zr;

        this.root = new Group();

        this.level = 0;

        this.dom = null;

        this.disableHover = false;

        this.mainNode = null;

        this.layout = null;
    }

    Level.prototype.init = function() {
        var graph = this.graph;

        var zr = this.zr;
        
        // 布局
        var force = new Force();
        force.width = screenSize.width();
        force.height = screenSize.height();
        force.graph = graph;
        force.init();

        this.layout = force;

        qtekUtil.each(graph.nodes, function(node) {
            node.entity = new NodeEntity({
                label: typeof(node.title) !== 'undefined' ? node.title : node.name,
                image: node.image,
                level: this.level,
                radius: node.radius
            });
            // 区分回退的节点
            // TODO 这里写死了
            if (node.action && node.action.indexOf('back') == 0) {
                node.entity.highlightColor = '#3791dc';
            }

            node.entity.update(zr);

            node.entity.group.position = node.position;

            this.root.addChild(node.entity.group);

            node.entity.on('mouseover', function() {
                if (this.disableHover) {
                    return;
                }
                this.highlightNode(node);
            }, this);

            // node.entity.on('mouseout', function() {
                // if (this.disableHover) {
                //     return;
                // }
                // this.leaveHighlight();
            // }, this);

            node.entity.on('click', function() {
                this.trigger('action', node.action, node);
            }, this);

        }, this);

        qtekUtil.each(graph.edges, function(edge) {
            var edgeEntity = new EdgeEntity({
                source: edge.source.entity,
                target: edge.target.entity,
                label: edge.label,
                level: this.level
            });

            // 区分回退的节点
            // TODO 这里写死了
            if (
                (edge.source.action && edge.source.action.indexOf('back') >= 0) ||
                (edge.target.action && edge.target.action.indexOf('back') >= 0)
            ) {
                edgeEntity.highlightColor = '#3791dc';
            }

            edge.entity = edgeEntity;
            this.root.addChild(edgeEntity.lineShape);
            if (edgeEntity.labelShape) {
                this.root.addChild(edgeEntity.labelShape);
            }

            // edge.entity.on('click', function() {
            //     var tmp = [edge.source.name, edge.target.name];
            //     var key1 = tmp.join(' ');
            //     var key2 = tmp.join('|');
            //     // log('zhishitupuclick', 'edge/' + key2);
            //     window.open('http://www.baidu.com/s?wd=' + key1);
            // })
        }, this);

        zr.addGroup(this.root);

        this.updateGraphRendering();
    }

    Level.prototype.startLayouting = function() {
        this.zr.animation.bind('frame', this.doLayout, this);

        this.trigger('startlayout');
    }

    Level.prototype.stopLayouting = function() {
        this.zr.animation.unbind('frame', this.doLayout);

        this.trigger('stoplayout');
    }

    Level.prototype.doLayout = function() {
        this.layout.update();
        this.updateGraphRendering();
        this.trigger('layout');
        // PENDING
        // 停止的逻辑放这？
        if (this.layout.isCoolDown()) {
            this.stopLayouting();
        } 
    }

    Level.prototype.getDom = function() {
        return this.zr.painter.getLayer(this.level).dom;
    }

    Level.prototype.leaveHighlight = function() {
        var graph = this.graph;
        var zr = this.zr;

        for (var i = 0; i < graph.nodes.length; i++) {
            graph.nodes[i].entity.leaveHighlight(zr);
            graph.nodes[i].entity.lineWidth = 5;
            graph.nodes[i].entity.update(zr);
        }
        for (var i = 0; i < graph.edges.length; i++) {
            graph.edges[i].entity.leaveHighlight(zr);

        }

        zr.refreshNextFrame();
    }

    Level.prototype.highlightAll = function() {
        var graph = this.graph;
        var zr = this.zr;

        for (var i = 0; i < graph.nodes.length; i++) {
            graph.nodes[i].entity.highlight(zr);
        }
        for (var i = 0; i < graph.edges.length; i++) {
            graph.edges[i].entity.highlight(zr);
        }

        zr.refreshNextFrame();
    }

    Level.prototype.highlightNode = function(node) {
        
        this.leaveHighlight();
        var zr = this.zr;

        node.entity.highlight(zr);

        node.entity.lineWidth = 8;
        node.entity.update(zr);

        // Highlight adjency nodes and edges
        for (var i = 0; i < node.edges.length; i++) {
            var edge = node.edges[i];
            edge.entity.highlight(zr);
            if (edge.source == node) {
                edge.target.entity.highlight(zr);
            } else {
                edge.source.entity.highlight(zr);
            }
        }

        zr.refreshNextFrame();
    }

    Level.prototype.updateGraphRendering = function() {
        for (var i = 0; i < this.graph.nodes.length; i++) {
            this.zr.modGroup(this.graph.nodes[i].entity.group.id);
        }
        for (var i = 0; i < this.graph.edges.length; i++) {
            this.graph.edges[i].entity.update(this.zr);
        }

        this.zr.refreshNextFrame();
    }

    Level.prototype.resize = function() {
        var zr = this.zr;

        this.layout.resize(zr.getWidth(), zr.getHeight());
        this.layout.warmUp(0.9);
        this.startLayouting();

        if (this.mainNode) {
            this.mainNode.position[0] = zr.getWidth() / 2;
            this.mainNode.position[1] = zr.getHeight() / 2;
        }

        if (this.graph) {
            for (var i = 0; i < this.graph.nodes.length; i++) {
                this.graph.nodes[i].entity.update(zr);
            }
        }
    }

    qtekUtil.extend(Level.prototype, notifier);

    return Level;
});