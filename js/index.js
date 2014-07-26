define(function(require) {

    var relation1 = JSON.parse(require('text!../data/relation1.json'));
    var zrender = require('zrender');

    var Graph = require('./Graph');
    var Level = require('./Level');
    var particles = require('./particles');

    var graph = new Graph();
    for (var i = 0; i < relation1.nodes.length; i++) {
        var node = graph.addNode(relation1.nodes[i].name);
        node.radius = relation1.nodes[i].radius;
        node.image = relation1.nodes[i].image;
    }
    for (var i = 0; i < relation1.edges.length; i++) {
        var e = relation1.edges[i];
        var edge = graph.addEdge(e.source, e.target, 1);
        edge.label = e.label;
    }

    var $main = document.getElementById('main');

    var zr = zrender.init($main);
    var animation = zr.animation;

    var level = new Level(graph, zr);
    level.init();

    zr.addGroup(level.root);
    zr.render();

    particles.start();
    animation.bind('frame', function(frameTime) {
        // particles.frame(frameTime);
    });

    window.onresize = function() {
        zr.resize();
        particles.resize();
    }
});