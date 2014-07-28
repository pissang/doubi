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
            weight: e.weight || 1,
            label: e.label
        });
    }

    var $main = document.getElementById('main');

    var zr = zrender.init($main);
    var animation = zr.animation;

    var currentLevel = new Level(graph, zr);
    currentLevel.init();
    currentLevel.doLayout();

    var levelStack = [currentLevel];

    currentLevel.on('action', handleAction);

    function handleAction(action, clickNode) {
        if (!action) {
            return;
        }
        var data, graph;
        if (action.indexOf('role/') == 0)  // 进入角色level
        {
            var graph = new Graph();
            var name = action.slice('role/'.length);
            var data = relation2.get(name, clickNode);
            if (!data) {
                return;
            }
        }
        else if (action.indexOf('actor/') == 0)  // 进入演员level
        {
            var graph = new Graph();
            var name = action.slice('actor/'.length);
            var data = relation3.get(name, clickNode, currentLevel.mainNode);
            if (!data) {
                return;
            }
        }
        else if (action == 'back') {
            leaveLevel();
        }
        // 进入下一个层级
        if (data && graph) {
            var mainNode;
            qtekUtil.each(data.nodes, function(item) {
                var n = graph.addNode(item.name, item);
                if (item.name == name ) {
                    mainNode = n;
                }
            });
            qtekUtil.each(data.edges, function(edge) {
                graph.addEdge(edge.source, edge.target, edge);
            });

            enterLevel(graph, zr, mainNode, clickNode);
        }
    }

    function enterLevel(graph, zr, mainNode, fromNode) {

        var level = new Level(graph, zr);
        level.level = levelStack.length;
        level.disableHover = true;
        level.mainNode = mainNode;
        // 在中心节点的周围进行预先布局
        mainNode.position = Array.prototype.slice.call(fromNode.position);
        mainNode.fixed = true;
        level.init();
        var prevScaling = level.layout._layout.scaling;
        level.layout._layout.center = Array.prototype.slice.call(fromNode.position);
        level.layout._layout.scaling = 0.6;
        level.doLayout();

        // 移动布局到整个界面中心
        level.layout._layout.center = [zr.getWidth() / 2, zr.getHeight() / 2];
        zr.animation.animate(mainNode)
            .when(300, {
                position: [zr.getWidth() / 2, zr.getHeight() / 2]
            })
            .start('CubicOut');

        zr.animation.animate(mainNode.entity)
            .when(0, {
                radius: fromNode.radius
            })
            .when(300, {
                radius: mainNode.radius
            })
            .during(function() {
                mainNode.entity.update(zr);
            })
            .start('CubicOut');

        level.layout._layout.maxSpeedIncrease = 10000.0;
        level.layout._layout.scaling = prevScaling;
        level.layout.steps = 10;
        level.layout.warmUp(0.7);
        level.startLayouting();

        level.highlightNode(mainNode);

        blurFilter.addImage(currentLevel.getDom());

        zr.animation.animate(blurFilter)
            .when(0, {
                blurSize: 0,
                scale: 1
            })
            .when(500, {
                scale: 0.95,
                blurSize: 5
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
                scale: 0.95,
                blurSize: 5
            })
            .when(500, {
                scale: 1,
                blurSize: 0
            })
            .during(function() {
                blurFilter.render();
            })
            .done(function() {
                zr.addGroup(currentLevel.root);
                zr.refresh();

                blurFilter.popImage();
                if (levelStack.length > 1) {
                    blurFilter.blurSize = 5;
                    blurFilter.scale = 0.95;
                    blurFilter.render();   
                } else {
                    blurFilter.clear();
                }
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