define(function(require) {

    var relation1 = JSON.parse(require('text!../data/relation1.json'));
    var relation2 = require('../data/relation2');
    var relation3 = require('../data/relation3');
    var qtekUtil = require('qtek/core/util');
    var Renderer = require('qtek/Renderer');

    var zrender = require('zrender');

    var Graph = require('./Graph');
    var Level = require('./Level');

    var isSupportWebGL = true;
    try {
        new Renderer();
    } catch (e) {
        isSupportWebGL = false;
    }
    if (isSupportWebGL) {
        var particles = require('./particles');
        var BlurFilter = require('./BlurFilter');
    } else {
        var particles = require('./particlesCanvas');
        var BlurFilter = require('./BlurFilterCanvas');
    }

    var outOfFocusCanvas = document.getElementById('out-of-focus');
    outOfFocusCanvas.width = window.innerWidth;
    outOfFocusCanvas.height = window.innerHeight;
    var blurFilter = new BlurFilter({
        canvas: outOfFocusCanvas
    });

    var graph = new Graph();
    var mainNode;
    for (var i = 0; i < relation1.nodes.length; i++) {
        var node = graph.addNode(relation1.nodes[i].name, relation1.nodes[i]);
        if (node.name == '林萧') {
            mainNode = node;
            //争取把林萧放到靠近中间的位置
            node.position = [window.innerWidth / 2, window.innerHeight / 2];
        }
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
    currentLevel.layout.steps = 10;
    currentLevel.startLayouting();

    currentLevel.highlightNode(mainNode);

    var levelStack = [currentLevel];

    currentLevel.on('action', handleAction);

    var inAnimation = false;

    function handleAction(action, clickNode) {
        if (!action || inAnimation) {
            return;
        }

        var data, graph;
        if (action.indexOf('role/') == 0)  // 进入角色level
        {
            var graph = new Graph();
            var name = action.slice('role/'.length);
            var data = relation2.get(name, clickNode);

            // currentLevel.leaveHighlight();
            // zr.refresh();

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
        else if (action.indexOf('detail/') == 0) {  //弹出浮层
            popupDetail(action.slice('actor/'.length));
        }
        else if (action == 'back') {   // 后退一级
            leaveLevel(!isSupportWebGL);
        }
        else if (action == 'back/back') { // 后退两级
            leaveLevel(true);
            leaveLevel(!isSupportWebGL);
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
        level.layout._layout.center = Array.prototype.slice.call(fromNode.position);
        level.layout._layout.scaling = 0.6;
        // 调整长宽比
        level.layout._layout.width /= 1.2;
        level.layout._layout.height *= 1.2;
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
        level.layout._layout.scaling = 1.2;
        level.layout.steps = 10;
        level.layout.warmUp(0.7);
        level.startLayouting();

        level.highlightAll();

        // 动画: 清晰->模糊
        blurCurrentLevel();        

        changeCurrentLevel(level);

        levelStack.push(level);
    }

    function leaveLevel(immediately) {
        var level = levelStack.pop();

        zr.delGroup(level.root);
        // TODO
        // 强制更新防止鼠标多次触发事件
        zr.storage.updateShapeList();

        changeCurrentLevel(levelStack[levelStack.length - 1]);

        if (!immediately) {
            // 动画: 模糊->清晰
            inAnimation = true;

            focusCurrentLevel();
        } else {
            zr.addGroup(currentLevel.root);
            zr.refreshNextFrame();
            blurFilter.popImage();
        }

        zr.refreshNextFrame();
    }

    function popupDetail(path) {
        blurCurrentLevel();
    }

    function closeDetail() {
        focusCurrentLevel();
    }

    function focusCurrentLevel(callback) {
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
                zr.refreshNextFrame();

                blurFilter.popImage();
                if (levelStack.length > 1) {
                    blurFilter.blurSize = 5;
                    blurFilter.scale = 0.95;
                    blurFilter.render();   
                } else {
                    blurFilter.clear();
                }

                inAnimation = false;

                callback && callback();
            })
            .start();

        inAnimation = true;
    }

    function blurCurrentLevel(callback) {

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
            .done(function() {
                inAnimation = false;

                callback && callback();
            })
            .start();

        zr.delGroup(currentLevel.root);
        // TODO
        // 强制更新防止鼠标多次触发事件
        zr.storage.updateShapeList();
        
        zr.refreshNextFrame();

        inAnimation = true;
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
        blurFilter.resize();
        if (currentLevel) {
            currentLevel.layout.resize(zr.getWidth(), zr.getHeight());
            currentLevel.layout.warmUp(0.9);
            currentLevel.startLayouting();

            if (currentLevel.mainNode) {
                currentLevel.mainNode.position[0] = zr.getWidth() / 2;
                currentLevel.mainNode.position[1] = zr.getHeight() / 2;
            }
        }

        for (var i = 0; i < levelStack.length - 1; i++) {
            levelStack[i].needsLayout = true;
        }
    }
});