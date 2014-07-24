define(function(require) {

    var Node3D = require('qtek/Node');
    var Vector4 = require('qtek/math/Vector4');
    var Vector3 = require('qtek/math/Vector3');
    var Matrix4 = require('qtek/math/Matrix4');

    var Group = require('zrender/shape/Group');
    var RectShape = require('zrender/shape/Rectangle');
    var CircleShape = require('zrender/shape/Circle');
    var TextShape = require('zrender/shape/Text');
    var ImageShape = require('zrender/shape/Image');

    function CircleStyle(option) {
        option = option || {};
        for (var name in option) {
            this[name] = option[name];
        }
    }
    CircleStyle.prototype.x = 0;
    CircleStyle.prototype.y = 0;
    CircleStyle.prototype.r = 50;

    var NodeEntity = Node3D.derive({
        
        group: null,

        visible: true,

        alpha: 1,

        lineWidth: 4,

        color: '#3791dc',

        labelColor: 'rgba(55, 145, 220, 0.5)',

        label: '',

        image: '',

        radius: 60,

        _depth: 0,

        _labelShape: null,
        _outlineShape: null,
        _imageShape: null

    }, function() {

        this.group = new Group();
        this.shapeList = [];

        var outlineShape = new CircleShape({
            style: new CircleStyle({
                color: this.color,
                r: this.radius + this.lineWidth,
                brushType: 'both'
            }),
            highlightStyle: {
                opacity: 0
            }
        });
        this.group.addChild(outlineShape);
        
        var contentGroup = new Group();
        var clipShape = new CircleShape({
            style: new CircleStyle({
                r: this.radius
            }),
            zlevel: 1
        });
        contentGroup.clipShape = clipShape;

        var imageShape = new ImageShape({
            style: {
                image: this.image,
                x: -this.radius,
                y: -this.radius,
                width: this.radius * 2,
                height: this.radius * 2
            },
            highlightStyle: {
                opacity: 0
            },
            zlevel: 1
        });
        var labelShape = new RectShape({
            style: {
                x: -this.radius,
                y: this.radius - 20,
                height: 20,
                width: this.radius * 2,

                color: this.labelColor,
                brushType: 'fill',
                text: this.label,
                textPosition: 'inside',
                textAlign: 'center',
                brushType: 'both',
                textColor: 'white'
            },
            highlightStyle: {
                opacity: 0
            },
            zlevel: 1
        });
        contentGroup.addChild(imageShape);
        contentGroup.addChild(labelShape);

        this.group.addChild(contentGroup);

        this._imageShape = imageShape;
        this._labelShape = labelShape;
        this._outlineShape = outlineShape;

        this.shapeList.push(this._imageShape);
        this.shapeList.push(this._labelShape);
        this.shapeList.push(this._outlineShape);
    }, {
        fadeIn: function(callback) {
            var self = this;
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

            this.group.position[0] = (x - width / 2) / w + width / 2;
            this.group.position[1] = (y - height / 2) / w + height / 2;

            // TODO
            this.group.scale[0] = this.scale._array[0] / w;
            this.group.scale[1] = this.scale._array[1] / w;

            // this.shape.style.opacity = this.alpha / Math.max(w, 1);

            if (z <= 0 || !this.visible) {
                this.group.ignore = true;
            } else {
                this.group.ignore = false;
            }

            this._depth = z;
        },

        unprojectCoord: function(x, y, zr) {
            var width = zr.getWidth();
            var height = zr.getHeight();

            x = (x - width / 2) * this._depth + width / 2;
            y = (y - width / 2) * this._depth + width / 2;

            this.position._array[0] = x;
            this.position._array[1] = y;
            this.position._dirty = true;
        }
    });

    return NodeEntity;
});