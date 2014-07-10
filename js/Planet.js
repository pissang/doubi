define(function(require) {

    var Node3D = require('qtek/Node');
    var Circle3D = require('./Circle3D');
    var LineShape = require('zrender/shape/Line');
    var Vector3 = require('qtek/math/Vector3');

    var echarts = require('echarts');
    var theme = require('./theme');

    var chartDom = document.getElementById('chart-container');
    var chart1 = echarts.init(document.getElementById('chart1'), theme);
    chart1.setOption({});
    var chart2 = echarts.init(document.getElementById('chart2'), theme);
    chart2.setOption({});

    // 球队图表
    var team_historyChart = require('./charts/team_history');
    var team_abilityChart = require('./charts/team_ability');
    var team_currentChart = require('./charts/team_current');
    var team_clubChart = require('./charts/team_club');

    // 对阵信息
    var vs_1Chart = require('./charts/vs_1');
    var vs_2Chart = require('./charts/vs_2');
    var vs_3Chart = require('./charts/vs_3');

    // 球员图表
    var player_abilityChart = require('./charts/player_ability');
    var player_currentChart = require('./charts/player_current');

    var animating = false;

    var presetMenuPositions = [
        [-350, -200],
        [-400, 200],
        [-580, 80]
    ]

    var backPosition = [-500, -100];
    var wordcupPosition = [-600, -290];

    var menuBigBG = new Image();
    menuBigBG.src = 'imgs/menubg.png';

    var Planet = Node3D.derive(function() {
        return {
            stage: null,

            zr: null,

            camera: null,

            animation: null,

            data: null,

            satellites: null,

            subCircles: [],

            lineShapes: [],
            
            circle: null,

            loading: 0,

            currentSubCircle: false,

            bleeding: true
        }
    }, function() {
        var self = this;
        var node = this.data;
        this.zr = this.stage.zr;

        var width = this.zr.getWidth();
        var height = this.zr.getHeight();

        var x = node.position[0] / 1000 * width;
        var y = node.position[1] / 600 * height;

        x = (x - width / 2) * 50 / node.r + width / 2;
        y = (y - height / 2) * 50 / node.r + height / 2;

        this.position.set(x, y, 40 / node.r);

        var circle = this.circle = new Circle3D({
            zr: this.zr,
            bleeding: self.bleeding
        });
        circle.shape.style.haveBackground = true;
        this.add(circle);
        this.zr.addShape(circle.shape);

        var shape = circle.shape;
        shape.clickable = true;
        shape.depth = this.position.z;

        this._extendCircleStyle(circle.shape, node.title || node.name, node.image);

        if (this.satellites) {
            this._buildSatellites();
        }

        if (this.bleeding) {
            this.circle.startBleeding(Math.random() * 500);
        }

        this.stage.root.add(this);

        if (this.data.type == 'vs') {
            circle.shape.style.lineWidth = 0;
        }

        if (this.data.type == 'country') {
            circle.shape.style.shadowBlur = 50;
            circle.shape.style.lineWidth = 1;
        }
    }, {

        setPosition: function(x, y) {

            var width = this.zr.getWidth();
            var height = this.zr.getHeight();
            
            x = x / 1000 * width;
            y = y / 600 * height;

            this.position.x = (x - width / 2) * 50 / this.data.r + width / 2;
            this.position.y = (y - height / 2) * 50 / this.data.r + height / 2;
        },

        focus: function() {
            for (var i = 0; i < this.subCircles.length; i++) {
                var subCircle = this.subCircles[i];
                subCircle.fadeIn();
                subCircle.startBleeding(Math.random() * 500);
            }

            for (var i = 0; i < this.lineShapes.length; i++) {
                var line = this.lineShapes[i];
                this.zr.animate(line.id, 'style')
                    .when(1000, {
                        opacity: 1
                    })
                    .start('CubicOut');
            }

            if (this.data.type != 'vs' && this.data.type != 'country') {
                this.circle.shape.style.lineWidth = 5;
            } else {
                this.circle.shape.style.lineWidth = 0;
            }
        },

        blur: function() {
            for (var i = 0; i < this.subCircles.length; i++) {
                this.subCircles[i].fadeOut();
                this.subCircles[i].stopBleeding();
            }

            for (var i = 0; i < this.lineShapes.length; i++) {
                var line = this.lineShapes[i];
                this.zr.animate(line.id, 'style')
                    .when(1000, {
                        opacity: 0
                    })
                    .start('CubicOut');
            }

        },

        hide: function() {
            var circle = this.circle;
            circle.fadeOut();
            circle.stopBleeding();
        },

        show: function() {
            var circle = this.circle;
            circle.shape.hidden = false;
            circle.fadeIn();
            circle.startBleeding(Math.random() * 500);
        },

        _buildSatellites: function() {
            var circle = this.circle;
            var self = this;

            circle.shape.style.textColor = 'white';
            // Sub menus
            this.satellites.forEach(function(item) {

                var subCircle = new Circle3D({
                    zr: this.zr,
                    bleeding: true,
                    data: item
                });

                subCircle.shape.style.haveBackground = true;

                subCircle.position.set(item.position[0], item.position[1], 0.5);

                this._extendCircleStyle(subCircle.shape, item.title, item.image);

                subCircle.shape.style.textFont = '22px 微软雅黑';

                subCircle.shape.hidden = true;
                subCircle.shape.style.alpha = 0;

                this.add(subCircle);

                var line = new LineShape({
                    style: {
                        xStart: 0,
                        yStart: 0,
                        xEnd: 0,
                        yEnd: 0,
                        lineWidth: 1,
                        strokeColor : '#6ed6ea',
                        opacity: 0.5,
                        lineType: 'dotted'
                    },
                    hoverable: false
                });

                line.source = circle.shape;
                line.target = subCircle.shape;
                line.style.opacity = 0;

                this.subCircles.push(subCircle);
                this.lineShapes.push(line);

                this.zr.addShape(line);

                if (item.back) {
                    subCircle.shape.clickable = true;
                    subCircle.shape.onclick = function() {
                        if (self.currentSubCircle) {
                            self._blurSubMenu();
                        }
                        self.trigger('back');
                    }
                } else {
                    subCircle.shape.clickable = true;
                    subCircle.shape.onclick = function() {
                        self._focusSubMenu(subCircle);
                    }
                }
            }, this);
        },

        _focusSubMenu: function(subCircle) {

            if (animating) {
                return;
            }
            animating = true;

            var self = this;

            var list = this.subCircles.slice();
            list.push(this.circle);

            chartDom.style.display = 'none';

            if (this.currentSubCircle) {
                this.currentSubCircle.shape.style.textColor = 'rgba(110, 214, 234, 1)';
                this.currentSubCircle.shape.style.image = null;
                this.zr.modShape(this.currentSubCircle.shape.id);
            }
            
            this.animation.animate(subCircle.position)
                .when(1000, {
                    x: 20,
                    y: 0,
                    z: -0.098
                })
                .during(function() {
                    self.stage.refresh();
                })
                .done(function() {
                    subCircle.shape.style.textColor = 'rgba(110, 214, 234, 0.05)';
                    self.zr.modShape(subCircle.shape.id);

                    self._showChart(subCircle);

                    animating = false;
                })
                .start('CubicOut');

            var idx = presetMenuPositions.length - 1;

            list.forEach(function(circle) {
                if (!circle._originPosition) {
                    circle._originPosition = circle.position.clone();
                }
                if (circle == subCircle) {
                    return;
                }
                if (circle == this.circle) {
                    var pos = backPosition;
                }
                else if (circle.data.back) {
                    var pos = wordcupPosition;
                } else {
                    var pos = presetMenuPositions[idx--];
                }
                this.animation.animate(circle.position)
                    .when(1000, {
                        z: 0.8,
                        x: pos[0],
                        y: pos[1]
                    })
                    .start('CubicOut');
            }, this);

            if (!this._backToIndex) {
                this._backToIndex = this.circle.shape.onclick;
            }
            this.circle.shape.onclick = function() {
                self._blurSubMenu();
            }

            subCircle.shape.style.lineWidth = 1;

            subCircle.shape.style.image = menuBigBG;

            self.currentSubCircle = subCircle;
        },

        _showChart: function(subCircle) {

            var x = subCircle.shape.position[0];
            var y = subCircle.shape.position[1];
            var r = subCircle.shape.style.r * subCircle.shape.scale[0] / 1.1;
            chartDom.style.left = Math.round(x - r) + 'px';
            chartDom.style.width = r * 2 + 'px';
            chartDom.style.height = r * 2 + 'px';
            chartDom.style.top = Math.round(y - r) + 'px';
            chartDom.style.display = 'block';

            chart1.clear();
            chart2.clear();

            if (this.data.type == 'country') {
                switch(subCircle.data.title) {
                    case "球员\n俱乐部":
                        team_clubChart.show(chart1, chart2, this.data.name);
                        break;
                    case "本届\n表现":
                        team_currentChart.show(chart1, chart2, this.data.name);
                        break;
                    case "历届\n表现":
                        team_historyChart.show(chart1, chart2, this.data.name);
                        break;
                    case "实力":
                        team_abilityChart.show(chart1, chart2, this.data.name);
                        break;
                }
            } else if (this.data.type == 'vs') {
                switch(subCircle.data.title) {
                    case "实力\n对比":
                        vs_1Chart.show(chart1, chart2);
                        break;
                    case "交战\n情况":
                        vs_2Chart.show(chart1, chart2);
                        break;
                    case "身价\n对比":
                        vs_3Chart.show(chart1, chart2);
                        break;
                }
            } else if (this.data.type == 'player') {
                switch(subCircle.data.title) {
                    case "实力":
                        player_abilityChart.show(chart1, chart2, this.data.team, this.data.playerName);
                        break;
                    case "本届\n表现":
                        player_currentChart.show(chart1, chart2, this.data.team, this.data.playerName);
                        break;
                }
            }

        },

        _blurSubMenu: function() {
            
            chartDom.style.display = 'none';

            if (animating) {
                return;
            }
            animating = true;

            var list = this.subCircles.slice();
            list.push(this.circle);
            var self = this;

            self.circle.shape.onclick = self._backToIndex;

            list.forEach(function(circle, idx) {
                var origin = circle._originPosition;

                var deferred = this.animation.animate(circle.position)
                    .when(1000, {
                        x: origin.x,
                        y: origin.y,
                        z: origin.z
                    })
                    .during(function() {
                        if (idx == 0) {
                            self.stage.refresh();
                        }
                    })
                    .done(function() {
                        animating = false;
                    })
                    .start('CubicOut');
            }, this);

            this.currentSubCircle.shape.style.textColor = 'rgba(110, 214, 234, 1)';
            this.currentSubCircle.shape.style.image = null;

            self.zr.modShape(this.currentSubCircle.shape.id);

            this.currentSubCircle = null;
        },

        _extendCircleStyle: function(shape, title, image) {
            if (title) {
                shape.style.text = title;
                shape.style.textPosition = 'inside';
                shape.style.textFont = '18px 微软雅黑';
                shape.style.textColor = '#6ed6ea';
            }
            shape.highlightStyle = {
                opacity: 0
            };
            var self = this;
            if (image) {
                self.loading++;
                var img = new Image();
                shape.style.image = img;
                img.onload = function() {
                    self.loading--;
                    if (self.loading == 0) {
                        self.trigger('success');
                    }
                }
                img.src = image;
            }
        }
    });

    return Planet;
});