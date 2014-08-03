define(function(require) {

    var Base = require('qtek/core/Base');

    var RectShape = require('zrender/shape/Rectangle');
    var LineShape = require('zrender/shape/Line');

    var glMatrix = require('glmatrix');
    var vec2 = glMatrix.vec2;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var v = vec2.create();
    var v1 = vec2.create();
    var v2 = vec2.create();

    var EdgeEntity = Base.derive({
        source: null,
        
        target: null,

        label: '',

        level: 0,

        color: '#3791dc',

        highlightColor: '#8c72d4'

    }, function() {

        var self = this;
        var onclick = function() {
            self.trigger('click');
        }

        this.lineShape = new LineShape({
            style: {
                lineWidth: 1,
                strokeColor: this.color,
                xStart: 0,
                yStart: 0,
                xEnd: 0,
                yEnd: 0,
                opacity: 0.4
            },
            highlightStyle: {
                opacity: 0
            },
            zlevel: this.level,
            z: 0.1
            // clickable: true,
            // onclick: onclick
        });

        if (this.label) {
            var width = ctx.measureText(this.label).width + 20;
            this.labelShape = new RectShape({
                style: {
                    width: width,
                    height: 20,
                    text: this.label,
                    textPosition: 'inside',
                    textAlign: 'center',
                    textFont: '14px 微软雅黑',
                    color: this.color,
                    brushType: 'fill',
                    x: -width / 2,
                    y: -20,
                    radius: 5
                },
                highlightStyle: {
                    opacity: 0
                },
                ignore: true,
                zlevel: this.level,
                z: 0.5
                // clickable: true,
                // onclick: onclick
            });
        }
    }, {

        update : function(zr) {
            var lineShape = this.lineShape;
            var sourceEntity = this.source;
            var targetEntity = this.target;

            var p1 = sourceEntity.group.position;
            var p2 = targetEntity.group.position;

            vec2.sub(v, p1, p2);
            vec2.normalize(v, v);

            vec2.scaleAndAdd(v1, p1, v, -sourceEntity.getBoundingRadius());
            vec2.scaleAndAdd(v2, p2, v, targetEntity.getBoundingRadius());

            lineShape.style.xStart = v1[0];
            lineShape.style.yStart = v1[1];
            lineShape.style.xEnd = v2[0];
            lineShape.style.yEnd = v2[1];

            lineShape.ignore = sourceEntity.ignore || targetEntity.ignore;

            zr.modShape(lineShape.id);

            if (this.labelShape) {
                var labelShape = this.labelShape;

                if (v[0] > 0) {
                    vec2.negate(v, v);
                }
                if (v[1] < 0) {
                    var angle = 2 * Math.PI - Math.acos(-v[0]);
                } else {
                    var angle = Math.acos(-v[0]);
                }
                labelShape.rotation[0] = angle;
                labelShape.position[0] = (v1[0] + v2[0]) / 2;
                labelShape.position[1] = (v1[1] + v2[1]) / 2;

                labelShape.style.opacity = 1;

                zr.modShape(labelShape.id);

                var len = vec2.distance(v1, v2);
                if (len > 50) {
                    this.labelShape.style.textFont = '14px 微软雅黑';
                    this.labelShape.scale[0] = this.labelShape.scale[1] = 1;
                } else {
                    this.labelShape.style.textFont = '12px 微软雅黑';
                    this.labelShape.scale[0] = this.labelShape.scale[1] = len / 50;
                }
            }
        },

        highlight : function(zr) {
            this.lineShape.style.lineWidth = 3;
            this.lineShape.style.strokeColor = this.highlightColor;
            this.lineShape.style.opacity = 1;
            this.lineShape.style.z = 10.1;
            zr.modShape(this.lineShape.id);

            if (this.labelShape) {
                this.labelShape.ignore = false;
                this.labelShape.style.color = this.highlightColor;
                this.labelShape.style.z = 10.5;
                zr.modShape(this.labelShape.id);
            }
        },

        leaveHighlight : function(zr) {
            this.lineShape.style.lineWidth = 1;
            this.lineShape.style.strokeColor = this.color;
            this.lineShape.style.opacity = 0.4;
            this.lineShape.style.z = 0.1;
            zr.modShape(this.lineShape.id);

            if (this.labelShape) {
                this.labelShape.ignore = true;   
                this.labelShape.style.color = this.color;
                this.labelShape.style.z = 0.5;
                zr.modShape(this.labelShape.id);
            }
        }

    });


    return EdgeEntity;
});