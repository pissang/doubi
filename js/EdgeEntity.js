define(function(require) {

    var RectShape = require('zrender/shape/Rectangle');
    var LineShape = require('zrender/shape/Line');

    var glMatrix = require('glmatrix');
    var vec2 = glMatrix.vec2;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var EdgeEntity = function(source, target, label) {

        this.source = source;

        this.target = target;

        this.label = label || '';

        this.lineShape = new LineShape({
            style: {
                lineWidth: 1,
                strokeColor: '#3791dc',
                xStart: 0,
                yStart: 0,
                xEnd: 0,
                yEnd: 0,
                opacity: 0.2
            },
            highlightStyle: {
                opacity: 0
            }
        });

        if (label) {
            var width = ctx.measureText(label).width + 20;
            this.labelShape = new RectShape({
                style: {
                    width: width,
                    height: 20,
                    text: label,
                    textPosition: 'inside',
                    textAlign: 'center',
                    color: '#3791dc',
                    brushType: 'fill',
                    x: -width / 2,
                    y: -20,
                    radius: 5
                },
                highlightStyle: {
                    opacity: 0
                },
                ignore: true
            });
        }
    }

    var v = vec2.create();

    EdgeEntity.prototype.update = function(zr) {
        var lineShape = this.lineShape;
        var sourceEntity = this.source;
        var targetEntity = this.target;

        var p1 = sourceEntity.group.position;
        var p2 = targetEntity.group.position;
        lineShape.style.xStart = p1[0];
        lineShape.style.yStart = p1[1];
        lineShape.style.xEnd = p2[0];
        lineShape.style.yEnd = p2[1];

        lineShape.ignore = sourceEntity.ignore || targetEntity.ignore;

        zr.modShape(lineShape.id);

        if (this.labelShape) {
            var labelShape = this.labelShape;

            vec2.sub(v, sourceEntity.group.position, targetEntity.group.position);
            vec2.normalize(v, v);

            if (v[0] > 0) {
                vec2.negate(v, v);
            }
            if (v[1] < 0) {
                var angle = 2 * Math.PI - Math.acos(-v[0]);
            } else {
                var angle = Math.acos(-v[0]);
            }
            labelShape.rotation[0] = angle;
            labelShape.position[0] = (p1[0] + p2[0]) / 2;
            labelShape.position[1] = (p1[1] + p2[1]) / 2;

            labelShape.style.opacity = 1;

            zr.modShape(labelShape.id);
        }
    }

    EdgeEntity.prototype.highlight = function() {
        this.lineShape.style.lineWidth = 2;
        this.lineShape.style.strokeColor = '#8c72d4';
        this.lineShape.style.opacity = 1;

        this.labelShape.ignore = false;
        this.labelShape.style.color = '#8c72d4';
    }

    EdgeEntity.prototype.leaveHighlight = function() {
        this.lineShape.style.lineWidth = 1;
        this.lineShape.style.strokeColor = '#3791dc';
        this.lineShape.style.opacity = 0.2;

        this.labelShape.style.color = '#3791dc';
        this.labelShape.ignore = true;
    }

    return EdgeEntity;
});