define(function(require) {

    var Vector3 = require('qtek/math/Vector3');

    var relation1 = JSON.parse(require('text!../data/relation1.json'));

    var NodeEntity = require('./NodeEntity');
    var EdgeEntity = require('./EdgeEntity');
    var Force = require('./Force');
    var Graph = require('./Graph');

    var force = new Force();
    var graph = new Graph();
    force.width = window.innerWidth;
    force.height = window.innerHeight;

    for (var i = 0; i < relation1.nodes.length; i++) {
        var node = graph.addNode(relation1.nodes[i].name);
        node.radius = relation1.nodes[i].radius;
    }
    for (var i = 0; i < relation1.edges.length; i++) {
        var e = relation1.edges[i];
        var edge = graph.addEdge(e.source, e.target, 1);
        edge.label = e.label;
    }
    force.graph = graph;
    force.run();

    var CanvasRenderer = require('./CanvasRenderer');

    var $main = document.getElementById('main');

    var stage = new CanvasRenderer($main);
    var zr = stage.zr;
    var animation = zr.animation;
    var camera = stage.camera;

    graph.nodes.forEach(function(node) {
        node.entity = new NodeEntity({
            label: node.name,
            image: 'imgs/person/林萧.jpg'
        });
        node.entity.position.z = 50 / node.radius;

        stage.add(node.entity);

        node.entity.on('hover', highlightNode, node)
    });

    function highlightNode(node) {
        for (var i = 0; i < graph.nodes.length; i++) {
            graph.nodes[i].entity.leaveHighlight();
        }
        for (var i = 0; i < graph.edges.length; i++) {
            graph.edges[i].entity.leaveHighlight();
        }
        this.entity.highlight();

        // Highlight adjency nodes and edges
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            edge.entity.highlight();
            if (edge.source == this) {
                edge.target.entity.highlight();
            } else {
                edge.source.entity.highlight();
            }
        }

        zr.render();
    }

    graph.edges.forEach(function(edge) {
        var edgeEntity = new EdgeEntity(edge.source.entity, edge.target.entity, edge.label);

        edge.entity = edgeEntity;
        zr.addShape(edgeEntity.lineShape);
        if (edgeEntity.labelShape) {
            zr.addShape(edgeEntity.labelShape);
        }
    })

    stage.update();

    for (var i = 0; i < graph.nodes.length; i++) {
        var node = graph.nodes[i];
        node.entity.unprojectCoord(node.position[0], node.position[1], zr);
    }

    stage.update();
    updateEdgeEntites();

    stage.render();

    function updateEdgeEntites() {
        for (var i = 0; i < graph.edges.length; i++) {
            graph.edges[i].entity.update(zr);
        }
    }

    window.onresize = function() {
        stage.resize();
    }
});