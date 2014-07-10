define(function(require) {

    var Node3D = require('qtek/Node');
    var Vector4 = require('qtek/math/Vector4');
    var Vector3 = require('qtek/math/Vector3');
    var Matrix4 = require('qtek/math/Matrix4');

    var ImageCircle = require('./ImageCircle');

    var Circle3D = Node3D.derive({
        
        shape: null,

        zr: null,

        bleeding: false,

        _depth: 0

    }, function() {

        this._bleedingShapes = [];

        this._bleedingDeferred = [];

        if (!this.shape) {
            this.shape = new ImageCircle({
                style: {
                    r: 50,
                    x: 0,
                    y: 0,
                    strokeColor : '#6ed6ea',
                    brushType : 'stroke',
                    lineWidth: 0,
                    shadowColor : '#6ed6ea',
                    shadowBlur : 0,
                    shadowOffsetX : 0,
                    shadowOffsetY : 0,
                    alpha: 1
                }
            });
        }

        if (this.bleeding) {
            for (var i = 0; i < 5; i++) {
                var circle = new Circle3D();
                this.add(circle);

                circle.shape.style = {
                    r: 50,
                    x: 0,
                    y: 0,
                    strokeColor : '#6ed6ea',
                    brushType : 'stroke',
                    lineWidth: 0.3,
                    alpha: 1
                }
                circle.shape.hoverable = false;
                circle.shape.hidden = true;

                this._bleedingShapes.push(circle.shape);
            }

        }
        if (this.zr) {
            this.addToZRender(this.zr);
        }
    }, {
        fadeIn: function(callback) {
            var self = this;
            self.shape.hidden = false;
            this.zr.animate(this.shape.id, 'style')
                .when(1000, {
                    alpha: 1
                })
                .done(function() {
                    callback && callback();
                })
                .start('CubicOut');
        },

        fadeOut: function(callback) {
            var self = this;
            this.zr.animate(this.shape.id, 'style')
                .when(1000, {
                    alpha: 0
                })
                .done(function() {
                    self.shape.hidden = true;
                    callback && callback();
                })
                .start('CubicOut');
        },

        projectShape: function(m4, zr) {
            m4 = m4._array;
            var x = m4[12];
            var y = m4[13];
            var z = m4[14];
            var w = z;
            
            var width = zr.getWidth();
            var height = zr.getHeight();

            var scale = Math.max(width / 1280, height / 800);

            this.shape.position[0] = (x - width / 2) / w * scale + width / 2;
            this.shape.position[1] = (y - height / 2) / w * scale + height / 2;

            // TODO
            this.shape.scale[0] = this.scale._array[0] / w * scale;
            this.shape.scale[1] = this.scale._array[1] / w * scale;

            this.shape.style.opacity = this.shape.style.alpha / Math.max(w, 1);

            if (z <= 0 || this.shape.hidden) {
                this.shape.invisible = true;
            } else {
                this.shape.invisible = false;
            }

            for (var i = 0; i < this._bleedingShapes.length; i++) {
                var bs = this._bleedingShapes[i];
                bs.style.lineWidth = Math.pow(Math.max(w, 0.5), 2);
            }

            this._depth = z;
        },

        startBleeding: function(offset) {
            var len = this._bleedingShapes.length;
            var w = this._depth;
            var r = this.shape.style.r;
            
            this._bleedingShapes.forEach(function(shape, idx) {
                shape.hidden = false;

                shape.style.r = r;
                shape.style.alpha = 0;

                var deferred = this.zr.animate(shape.id, 'style', true)
                    .delay(idx / len * 4000 + offset)
                    .when(0, {
                        alpha: 1
                    })
                    .when(4000, {
                        r: this.shape.style.r * 1.4,
                        alpha: 0
                    })
                    .during(function() {
                        shape.style.opacity = shape.style.alpha / Math.pow(Math.max(w, 1), 3);
                    })
                    .start();

                this.zr.modShape(shape.id);

                this._bleedingDeferred.push(deferred);
            }, this);
        },

        stopBleeding: function() {
            for (var i = 0; i < this._bleedingDeferred.length; i++) {
                this._bleedingDeferred[i].stop();
            }
            this._bleedingDeferred.length = 0;

            for (var i = 0; i < this._bleedingShapes.length; i++) {
                this._bleedingShapes[i].hidden = true;
            }
        },

        addToZRender: function(zr) {
            zr.addShape(this.shape);
            for (var i = 0; i < this._bleedingShapes.length; i++) {
                zr.addShape(this._bleedingShapes[i]);
            }
        },

        removeFromZRender: function(zr) {
            zr.delShape(this.shape.id);
            for (var i = 0; i < this._bleedingShapes.length; i++) {
                zr.delShape(this._bleedingShapes[i].id);
            }
        }
    });

    return Circle3D;
});