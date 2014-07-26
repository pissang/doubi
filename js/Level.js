define(function(require) {

    var Group = require('zrender/shape/Group');

    var NodeEntity = require('./NodeEntity');
    var EdgeEntity = require('./EdgeEntity');
    var Force = require('./Force');

    var Level = function(graph, zr) {

        this.graph = graph;

        this.zr = zr;

        this.root = new Group();

        this.level = 0;

        this.canvas = null;
    }

    Level.prototype.init = function() {
        
        var graph = this.graph;

        var zr = this.zr;
        
        // 布局
        var force = new Force();
        force.width = window.innerWidth;
        force.height = window.innerHeight;

        force.graph = graph;
        force.run();

        graph.layout = force;

        // 更新节点位置大小
        graph.nodes.forEach(function(node) {
            node.entity = new NodeEntity({
                label: node.name,
                image: node.image,
                level: this.level
            });

            node.entity.group.position = node.position;
            node.entity.group.scale[0] = 
            node.entity.group.scale[1] = node.radius / 50;

            this.root.addChild(node.entity.group);

            node.entity.on('hover', function() {
                this.highlightNode(node);
            }, this);

            node.entity.on('click', function() {
                this.highlightNode(node);
            }, this);

        }, this);

        graph.edges.forEach(function(edge) {
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

        this.updateEdgeEntites();

        zr.addGroup(this.root);
        zr.refresh();

        this.dom = zr.painter.getLayer(this.level).dom;
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

    Level.prototype.updateEdgeEntites = function() {
        for (var i = 0; i < this.graph.edges.length; i++) {
            this.graph.edges[i].entity.update(this.zr);
        }
    }

    Level.prototype.outOfFocus = function() {

    }

    return Level;
});