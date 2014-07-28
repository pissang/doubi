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

        level: 0

    }, function() {

        this.lineShape = new LineShape({
            style: {
                lineWidth: 1,
                strokeColor: '#3791dc',
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
                    textFont: '12px 微软雅黑',
                    color: '#3791dc',
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

            vec2.scaleAndAdd(v1, p1, v, -sourceEntity.radius);
            vec2.scaleAndAdd(v2, p2, v, targetEntity.radius);

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
            }
        },

        highlight : function(zr) {
            this.lineShape.style.lineWidth = 3;
            this.lineShape.style.strokeColor = '#8c72d4';
            this.lineShape.style.opacity = 1;
            zr.modShape(this.lineShape.id);

            if (this.labelShape) {
                this.labelShape.ignore = false;
                this.labelShape.style.color = '#8c72d4';
                zr.modShape(this.labelShape.id);
            }
        },

        leaveHighlight : function(zr) {
            this.lineShape.style.lineWidth = 1;
            this.lineShape.style.strokeColor = '#3791dc';
            this.lineShape.style.opacity = 0.4;
            zr.modShape(this.lineShape.id);

            if (this.labelShape) {
                this.labelShape.style.color = '#3791dc';
                this.labelShape.ignore = true;   
                zr.modShape(this.labelShape.id);
            }
        }

    });


    return EdgeEntity;
});