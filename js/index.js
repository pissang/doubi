define(function(require) {

    var relation1 = JSON.parse(require('text!../data/relation1.json'));
    var relation2 = require('../data/relation2');
    var relation3 = require('../data/relation3');
    var qtekUtil = require('qtek/core/util');

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
        var node = graph.addNode(relation1.nodes[i].name, relation1.nodes[i]);
    }
    for (var i = 0; i < relation1.edges.length; i++) {
        var e = relation1.edges[i];
        var edge = graph.addEdge(e.source, e.target, {
            weight: 1,
            label: e.label
        });
    }

    var $main = document.getElementById('main');

    var zr = zrender.init($main);
    var animation = zr.animation;

    var currentLevel = new Level(graph, zr);
    currentLevel.init();

    var levelStack = [currentLevel];

    currentLevel.on('action', handleAction);

    function handleAction(action, node) {
        if (!action) {
            return;
        }
        if (action.indexOf('role/') == 0) {  // 进入角色level
            var graph = new Graph();
            var name = action.slice('role/'.length);
            var data = relation2.get(name, node);
            if (!data) {
                return;
            }
            var mainNode;
            qtekUtil.each(data.nodes, function(node) {
                var n = graph.addNode(node.name, node);
                if (node.name == name ) {
                    mainNode = n;
                }
            });
            qtekUtil.each(data.edges, function(edge) {
                graph.addEdge(edge.source, edge.target, edge);
            });

            mainNode.position = [zr.getWidth() / 2, zr.getHeight() / 2];

            var level = new Level(graph, zr);
            level.level = levelStack.length;
            level.disableHover = true;
            level.init();

            level.mainNode = mainNode;

            level.highlightNode(mainNode);

            enterLevel(level);
        }
        else if (action.indexOf('actor/') == 0)  // 进入演员level
        {
            var graph = new Graph();
            var name = action.slice('actor/'.length);
            var data = relation3.get(name, currentLevel.mainNode);
            if (!data) {
                return;
            }
            var mainNode;
            qtekUtil.each(data.nodes, function(node) {
                var n = graph.addNode(node.name, node);
                if (node.name == name ) {
                    mainNode = n;
                }
            });
            qtekUtil.each(data.edges, function(edge) {
                graph.addEdge(edge.source, edge.target, edge);
            });

            mainNode.position = [zr.getWidth() / 2, zr.getHeight() / 2];

            var level = new Level(graph, zr);
            level.level = levelStack.length;
            level.disableHover = true;
            level.init();
            
            level.mainNode = mainNode;

            level.highlightNode(mainNode);

            enterLevel(level);
        }
        else if (action == 'back') {

            leaveLevel();
        }
    }

    function enterLevel(level) {

        if (levelStack.length > 1) {
            // TODO
            blurFilter.popImage();
        }

        blurFilter.addImage(currentLevel.getDom());

        zr.animation.animate(blurFilter)
            .when(0, {
                blurSize: 0,
                scale: 1
            })
            .when(200, {
                blurSize: 3
            })
            .when(500, {
                scale: 0.95
            })
            .during(function() {
                blurFilter.render();
            })
            .start();

        zr.delGroup(currentLevel.root);

        changeCurrentLevel(level);

        levelStack.push(level);
    }

    function leaveLevel() {
        var level = levelStack.pop();

        zr.delGroup(level.root);

        changeCurrentLevel(levelStack[levelStack.length - 1]);

        zr.animation.animate(blurFilter)
            .when(0, {
                blurSize: 3,
                scale: 0.95
            })
            .when(200, {
                blurSize: 0
            })
            .when(500, {
                scale: 0.95
            })
            .during(function() {
                blurFilter.render();
            })
            .done(function() {
                zr.addGroup(currentLevel.root);
                zr.refresh();

                blurFilter.popImage();
                blurFilter.clear();
            })
            .start();

        zr.refreshNextFrame();
    }

    function changeCurrentLevel(level) {
        currentLevel.off('action');
        level.on('action', handleAction);
        currentLevel = level;
    }

    particles.start();
    animation.bind('frame', function(frameTime) {
        particles.frame(Math.min(frameTime, 100));
    });

    window.onresize = function() {
        zr.resize();
        particles.resize();
    }
});