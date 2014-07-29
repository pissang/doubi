define(function(require) {

    var Base = require('qtek/core/Base');

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

    var textNodeBG = new Image();
    textNodeBG.src = 'imgs/text-node-bg.png';

    var NodeEntity = Base.derive({
        
        group: null,

        visible: true,

        alpha: 1,

        lineWidth: 5,

        color: '#3791dc',

        labelColor: 'rgba(55, 145, 220, 0.5)',

        highlightColor: '#8c72d4',

        highlightLabelColor: 'rgba(140, 114, 212, 0.5)',

        label: '',

        image: '',

        radius: 60,

        level: 0,

        _depth: 0,

        _labelShape: null,
        _outlineShape: null,
        _imageShape: null,
        _shadowShape: null,
        _glowShape: null,

        _clipShape: null

    }, function() {

        this.group = new Group();
        this.shapeList = [];

        var self = this;

        var outlineShape = new CircleShape({
            style: new CircleStyle({
                strokeColor: this.color,
                brushType: 'stroke'
            }),
            highlightStyle: {
                opacity: 0
            },
            z: 2,
            zlevel: this.level,
            clickable: true,
            onclick: function() {
                self.trigger('click');
            },
            onmouseover: function() {
                self.trigger('mouseover');
            },
            onmouseout: function() {
                self.trigger('mouseout');
            }
        });
        var glowShape = new CircleShape({
            style: new CircleStyle({
                strokeColor: this.highlightColor,
                brushType: 'stroke',
                opacity: 0.3
            }),
            highlightStyle: {
                opacity: 0
            },
            z: 1.5,
            ignore: true,
            zlevel: this.level,
            hoverable: false,
        });

        var shadowShape = new CircleShape({
            style: new CircleStyle({
                brushType: 'stroke',
                shadowColor: 'black',
                shadowBlur: 15,
                shadowOffsetX: 0,
                shadowOffsetY: 0
            }),
            z: 0.5,
            zlevel: this.level,
            hoverable: false
        });
        this.group.addChild(shadowShape);
        this.group.addChild(outlineShape);
        this.group.addChild(glowShape);
        
        var contentGroup = new Group();
        var clipShape = new CircleShape({
            style: new CircleStyle({
                r: this.radius
            })
        });
        contentGroup.clipShape = clipShape;

        var imageShape = new ImageShape({
            style: {
                image: this.image || textNodeBG
            },
            hoverable: false,
            z: 1,
            zlevel: this.level
        });

        if (this.label) {
            var labelShape = new RectShape({
                style: {
                    color: this.labelColor,
                    brushType: 'fill',
                    text: this.label,
                    textPosition: 'inside',
                    textAlign: 'center',
                    brushType: 'both',
                    textColor: 'white',
                    textFont: '14px 微软雅黑'
                },
                hoverable: false,
                z: 1,
                zlevel: this.level
            });

            if (!this.image) {
                // Empty inside
                labelShape.style.color = 'rgba(0, 0, 0, 0)';
                labelShape.style.textFont = '20px 微软雅黑';
            }
        }

        contentGroup.addChild(imageShape);
        if (labelShape) {
            contentGroup.addChild(labelShape);
        }

        this.group.addChild(contentGroup);

        this._imageShape = imageShape;
        this._labelShape = labelShape;
        this._outlineShape = outlineShape;
        this._clipShape = clipShape;
        this._shadowShape = shadowShape;
        this._glowShape = glowShape;

        this.shapeList.push(this._imageShape);

        if (this._labelShape) {
            this.shapeList.push(this._labelShape);
        }
        
        this.shapeList.push(this._outlineShape);
    }, {

        update: function(zr) {
            var ratio = Math.min(zr.getWidth() / 1280, zr.getHeight() / 800);
            var radius = ratio * this.radius;

            this._outlineShape.style.r = radius;
            this._outlineShape.style.lineWidth = radius / 50 * this.lineWidth;
            this._glowShape.style.lineWidth = this._outlineShape.style.lineWidth * 2;
            this._glowShape.style.r = radius + this._outlineShape.style.lineWidth;

            this._shadowShape.style.r = this._outlineShape.style.r;
            this._shadowShape.style.lineWidth = this._outlineShape.style.lineWidth;

            this._imageShape.style.x = -radius;
            this._imageShape.style.y = -radius;
            this._imageShape.style.width = radius * 2;
            this._imageShape.style.height = radius * 2;

            this._clipShape.style.r = radius;

            if (this._labelShape) {
                if (this.image) {
                    this._labelShape.style.x = -radius;
                    this._labelShape.style.y = radius - 20;
                    this._labelShape.style.width = radius * 2;
                    this._labelShape.style.height = 20;
                } else {
                    this._labelShape.style.x = -radius;
                    this._labelShape.style.y = -radius;
                    this._labelShape.style.width = radius * 2;
                    this._labelShape.style.height = radius * 2;
                }
                zr.modShape(this._labelShape.id);
            }

            zr.modShape(this._outlineShape.id);
            zr.modShape(this._imageShape.id);
            zr.modShape(this._shadowShape.id);

            zr.modGroup(this.group.id);
        },

        getBoundingRadius: function() {
            return this._outlineShape.style.r + this._outlineShape.style.lineWidth / 2;
        },

        highlight: function() {
            this._outlineShape.style.strokeColor = this.highlightColor;
            this._glowShape.ignore = false;
            if (this.image && this._labelShape) {
                this._labelShape.style.color = this.highlightLabelColor;
            }
        },

        leaveHighlight: function() {
            this._outlineShape.style.strokeColor = this.color;
            this._glowShape.ignore = true;
            if (this.image && this._labelShape) {
                this._labelShape.style.color = this.labelColor;
            }
        }
    });

    return NodeEntity;
});