define(function(require) {

    require('echarts');
    require('echarts/chart/line');
    require('echarts/chart/bar');
    require('echarts/chart/scatter');
    require('echarts/chart/k');
    require('echarts/chart/pie');
    require('echarts/chart/radar');
    require('echarts/chart/force');
    require('echarts/chart/chord');
    require('echarts/chart/gauge');
    require('echarts/chart/funnel');


    var particles = require('./particles');
    particles.start();

    var Node3D = require('qtek/Node');
    var TaskGroup = require('qtek/async/TaskGroup');
    var Vector3 = require('qtek/math/Vector3');
    var LineShape = require('zrender/shape/Line');
    var TextShape = require('zrender/shape/Text');
    var glMatrix = require('glmatrix');
    var vec2 = glMatrix.vec2;

    var Circle3D = require('./Circle3D');
    var Planet = require('./Planet');
    var Force = require('./Force');
    var force = new Force({
        width: window.innerWidth,
        height: window.innerHeight
    });
    var graphData = require('js/graphData');
    var eventsData = require('js/eventsData');
    var CanvasRenderer = require('./CanvasRenderer');

    var $cover = document.getElementById('cover');

    var _event = require('./event');


    var $main = document.getElementById('main');

    var stage = new CanvasRenderer($main);
    var zr = stage.zr;
    var animation = zr.animation;
    var camera = stage.camera;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var planets = [];
    var loadingPlanets = [];

    var circleShapeMap = {};
    var planetsMap = {};

    var lineList = [];

    var loading = 0;

    var shapeList = [];

    var currentPlanet = null;
    var animating = false;

    graphData.nodes.forEach(function(node) {
        var planet = new Planet({
            data: node,
            stage: stage,
            animation: animation,
            camera: camera,
            satellites: graphData.menus[node.type],
            bleeding: true
        });
        if (planet.loading > 0) {
            loadingPlanets.push(planet);
        }
        planet.circle.shape.name = node.name;

        for (var i = 0; i < planet.lineShapes.length; i++) {
            lineList.push(planet.lineShapes[i]);
        }

        circleShapeMap[node.name] = planet.circle.shape;
        planet.circle.shape.zlevel = 2;

        if (graphData.menus[node.type]) {
            planet.circle.shape.onclick = function() {
                focus(planet);
            }
        }

        planets.push(planet);

        planet.on('back', back);

        force.addNode(node.name, node.r, node.position, node.fixed);

        planetsMap[node.name] = planet;
    });

    var taskGroup = new TaskGroup();
    if (loadingPlanets.length > 0) {
        taskGroup.all(loadingPlanets).success(function() {
            stage.render();
        });
    }

    graphData.links.forEach(function(link) {
        createLink(link);

        force.addLink(link.source, link.target);
    });

    function createLine() {
        var line = new LineShape({
            style: {
                xStart: 0,
                yStart: 0,
                xEnd: 0,
                yEnd: 0,
                lineWidth: 1,
                strokeColor : '#6ed6ea',
                opacity: 0.5,
                // lineType: 'dotted'
            },
            zlevel: 1,
            highlightStyle: {
                opacity: 0
            },
        });
        return line;
    }

    function createLink(link) {
        if (!circleShapeMap[link.source] || !circleShapeMap[link.target]) {
            return;
        }
        var line = createLine();
        line.source = circleShapeMap[link.source];
        line.target = circleShapeMap[link.target];

        shapeList.push(line);
        lineList.push(line)

        zr.addShape(line);

        var scale = Math.min(planetsMap[link.source].data.r, planetsMap[link.target].data.r) / 30;
        scale = Math.min(scale, 1);

        line.style.lineWidth = Math.max(scale, 0.5) * 2;
        if (link.title) {
            var text = new TextShape({
                style: {
                    x: 0, 
                    y: 0,
                    textAlign: 'center',
                    text: link.title,
                    textFont: '14px 微软雅黑',
                    textBaseline: 'bottom',
                    color : '#6ed6ea',
                    opacity: 0.7
                },
                hoverable: false
            });
            text.scale[0] = scale;
            text.scale[1] = scale;
            zr.addShape(text);

            line.text = text;

            shapeList.push(line.text);

            line.clickable = true;
            text.clickable = true;

            if (eventsData[link.title]) {
                text.style.color = 'white';
                line.style.strokeColor = 'white';
                line.style.lineWidth = 2;
                line.style.lineType = 'solid';
                line.onclick = function() {
                    showEvent(eventsData[link.title]);
                }
                text.onclick = function() {
                    showEvent(eventsData[link.title]);
                }
            }
        }
    }

    stage.on('afterupdate', function() {
        var v1 = vec2.create();
        var v2 = vec2.create();
        var v = vec2.create();
        for (var i = 0; i < lineList.length; i++) {
            var line = lineList[i];

            vec2.sub(v, line.source.position, line.target.position);
            vec2.normalize(v, v);

            vec2.scaleAndAdd(v1, line.source.position, v, (-line.source.style.r - line.source.style.lineWidth / 2) * line.source.scale[0]);
            vec2.scaleAndAdd(v2, line.target.position, v, (line.target.style.r + line.target.style.lineWidth / 2) * line.target.scale[0]);

            line.style.xStart = v1[0];
            line.style.yStart = v1[1];
            line.style.xEnd = v2[0];
            line.style.yEnd = v2[1];

            line.style.opacity = Math.min(line.source.style.opacity, line.target.style.opacity);

            if (line.source.invisible || line.target.invisible) {
                line.invisible = true;
            } else {
                line.invisible = false;
            }
            if (line.text) {
                line.text.invisible = line.invisible;

                if (v[0] > 0) {
                    vec2.negate(v, v);
                }
                if (v[1] < 0) {
                    var angle = 2 * Math.PI - Math.acos(-v[0]);
                } else {
                    var angle = Math.acos(-v[0]);
                }
                line.text.rotation[0] = angle;
                line.text.position[0] = (v1[0] + v2[0]) / 2;
                line.text.position[1] = (v1[1] + v2[1]) / 2;

                line.text.style.opacity = line.style.opacity

                zr.modShape(line.text.id);
            }

            zr.modShape(line.id);
        }
    });

    function during(target) {
        target._dirty = true;
        stage.refresh();
    }

    function showEvent(list) {

        _event.show(stage, animation, list);
    }

    function focus(planet) {
        if (currentPlanet || animating) {
            return;
        }
        currentPlanet = planet;
        animating = true;

        var pos = new Vector3();
        pos.copy(planet.position);
        pos.x -= zr.getWidth() / 2;
        pos.y -= zr.getHeight() / 2;
        pos.z -= 0.25;

        camera._orignalPosition = camera.position.clone();

        animation.animate(camera.position)
            .when(1000, {
                _array: pos._array
            })
            .during(during)
            .done(function() {
                animating = false;
            })
            .start('CubicOut');
        // camera.angle = 0;
        // animation.animate(camera)
        //     .when(1000, {
        //         angle: Math.random() * 0.2
        //     })
        //     .during(function(target) {
        //         camera.rotation.identity().rotateZ(camera.angle);
        //     })
        //     .start('CubicOut');

        for (var i = 0; i < shapeList.length; i++) {
            var shape = shapeList[i];
            zr.animate(shape.id, 'style')
                .when(1000, {
                    opacity: 0
                })
                .start('CubicOut');
        }

        for (var i = 0; i < planets.length; i++) {
            if (planets[i] !== planet) {
                planets[i].hide();
            }
        }

        planet.focus(zr);

    }

    function back() {
        if (!currentPlanet || animating) {
            return;
        }
        animating = true;

        animation.animate(camera.position)
            .when(1000, {
                _array: camera._orignalPosition._array
            })
            .during(during)
            .done(function() {
                animating = false;
            })
            .start('CubicOut');

        // animation.animate(camera)
        //     .when(1000, {
        //         angle: 0
        //     })
        //     .during(function(target) {
        //         camera.rotation.identity().rotateZ(camera.angle);
        //     })
        //     .start('CubicOut');

        for (var i = 0; i < shapeList.length; i++) {
            var shape = shapeList[i];
            zr.animate(shape.id, 'style')
                .when(1000, {
                    opacity: 1
                })
                .start('CubicOut');
        }

        for (var i = 0; i < planets.length; i++) {
            if (planets[i] !== currentPlanet) {
                planets[i].show();
            }
        }

        currentPlanet.blur(zr);

        currentPlanet = null;
    }

    stage.render();

    stage.on('frame', function(frameTime) {

        if (frameTime < 1000) {
            particles.frame(frameTime);
            force.step(frameTime);
        }

        for (var i = 0; i < planets.length; i++) {
            var planet = planets[i];
            if (!planet.data.fixed) {
                planet.setPosition(planet.data.position[0], planet.data.position[1]);
            }
        }

        stage.refresh();
    });

    animating = true;
    animation.animate(camera.position)
        .when(0, {
            z: -1
        })
        .when(500, {
            z: 0
        })
        .done(function() {
            animating = false;
        })
        .start('CubicOut');

    // var inDrag = false;
    // var x = 0;
    // var y = 0;
    // document.body.addEventListener('mousedown', function(e) {
    //     if (currentPlanet) {
    //         return;
    //     }
    //     inDrag = true;
    //     x = e.pageX;
    //     y = e.pageY;
    // });
    // document.body.addEventListener('mousemove', function(e) {
    //     if (currentPlanet) {
    //         return;
    //     }
    //     if (inDrag) {
    //         var dx = e.pageX - x;
    //         var dy = e.pageY - y;

    //         camera.position.x -= dx / 5;
    //         camera.position.y -= dy / 5;

    //         camera.position.x = Math.max(Math.min(camera.position.x, 100), -100);
    //         camera.position.y = Math.max(Math.min(camera.position.y, 100), -100);

    //         x = e.pageX;
    //         y = e.pageY;
    //     }
    // });
    // document.body.addEventListener('mouseup', function(e) {
    //     inDrag = false;
    // });

    // document.body.addEventListener('mousewheel', mouseWheel);
    // document.body.addEventListener('DOMMouseScroll', mouseWheel);

    // function mouseWheel(e) {
    //     if (currentPlanet) {
    //         return;
    //     }
    //     var delta = e.wheelDelta
    //                 || -e.detail;

    //     camera.position.z += delta > 0 ? 0.05 : -0.05;

    //     camera.position.z = Math.max(Math.min(camera.position.z, 0.2), -0.5);
    // }

    window.onresize = function() {
        stage.resize();
    }
});