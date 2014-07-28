define(function(require) {

    var Group = require('zrender/shape/Group');

    var NodeEntity = require('./NodeEntity');
    var EdgeEntity = require('./EdgeEntity');
    var Force = require('./Force');

    var notifier = require('qtek/core/mixin/notifier');
    var qtekUtil = require('qtek/core/util');

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
        force.width = window.innerWidth;
        force.height = window.innerHeight;

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
            node.entity.update(zr);

            node.entity.group.position = node.position;

            this.root.addChild(node.entity.group);

            node.entity.on('mouseover', function() {
                if (this.disableHover) {
                    return;
                }
                this.highlightNode(node);
            }, this);

            node.entity.on('mouseout', function() {
                if (this.disableHover) {
                    return;
                }
                this.leaveHighlight();
            }, this);

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

            edge.entity = edgeEntity;
            this.root.addChild(edgeEntity.lineShape);
            if (edgeEntity.labelShape) {
                this.root.addChild(edgeEntity.labelShape);
            }
        }, this);

        zr.addGroup(this.root);

        this.updateGraphRendering();
    }

    Level.prototype.startLayouting = function() {
        this.zr.animation.bind('frame', this.doLayout, this);
    }

    Level.prototype.stopLayouting = function() {
        this.zr.animation.unbind('frame', this.doLayout);
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
        }
        for (var i = 0; i < graph.edges.length; i++) {
            graph.edges[i].entity.leaveHighlight(zr);
        }

        zr.refreshNextFrame();
    }

    Level.prototype.highlightNode = function(node) {
        
        this.leaveHighlight();
        var zr = this.zr;

        node.entity.highlight(zr);

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

    qtekUtil.extend(Level.prototype, notifier);

    return Level;
});