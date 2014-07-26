define(function(require) {

    var relation1 = JSON.parse(require('text!../data/relation1.json'));
    var zrender = require('zrender');

    var Graph = require('./Graph');
    var Level = require('./Level');
    var particles = require('./particles');
    var BlurFilter = require('./BlurFilter');

    var outOfFocusCanvas = document.getElementById('out-of-focus');
    outOfFocusCanvas.width = window.innerWidth;
    outOfFocusCanvas.height = window.innerHeight;
    var blurFilter = new BlurFilter({
        canvas: outOfFocusCanvas
    });

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

    blurFilter.addImage(level.dom);
    setTimeout(function() {
        zr.animation.animate(blurFilter)
            .when(0, {
                blurSize: 0,
                scale: 1
            })
            .when(200, {
                blurSize: 3
            })
            .when(500, {
                scale: 0.8
            })
            .during(function() {
                blurFilter.render();
            })
            .start();

        // level.graph.layout.run();
        // level.updateEdgeEntites();

        // zr.refresh();
    }, 1000);

    particles.start();
    animation.bind('frame', function(frameTime) {
        // particles.frame(frameTime);
    });

    window.onresize = function() {
        zr.resize();
        particles.resize();
    }
});