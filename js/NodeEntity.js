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

    var ctx = document.createElement('canvas').getContext('2d');

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

        clickable: true,

        _depth: 0,

        _labelShape: null,
        _outlineShape: null,
        _imageShape: null,
        _shadowShape: null,
        _glowShape: null,

        _clipShape: null,

        _labelHeight: 25

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
            clickable: this.clickable,
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
            z: 0.9,
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
            // TODO
            // 简单的换行机制
            var wrapLabel = false;
            var labelWidth = ctx.measureText(this.label.split('\n')[0]).width;
            if (labelWidth > this.radius && this.image) {
                var len = this.label.length;
                var idx = Math.round(len / 1.4);
                this.label = this.label.substr(0, idx) + '\n' + this.label.substr(idx);
                this._labelHeight = 40;
                wrapLabel = true;
            }

            var labelShape = new RectShape({
                style: {
                    color: this.labelColor,
                    brushType: 'fill',
                    text: this.label,
                    textPosition: 'inside',
                    textAlign: 'center',
                    brushType: 'both',
                    textColor: 'white',
                    textFont: this.radius > 50 ? '14px 微软雅黑' : '12px 微软雅黑'
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
            var width = zr.getWidth();
            var height = zr.getHeight();
            if (width > height) {
                var ratio = Math.min(width / 1280, height / 800);
            } else {
                var ratio = Math.min(height / 1280, width / 800);
            }
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
                    this._labelShape.style.y = radius - this._labelHeight;
                    this._labelShape.style.width = radius * 2;
                    this._labelShape.style.height = this._labelHeight;
                } else {
                    this._labelShape.style.x = -radius;
                    this._labelShape.style.y = -radius;
                    this._labelShape.style.width = radius * 2;
                    this._labelShape.style.height = radius * 2;
                }
            }

            this._outlineShape.clickable = this.clickable;

            zr.modGroup(this.group.id);
        },

        getBoundingRadius: function() {
            return this._outlineShape.style.r + this._outlineShape.style.lineWidth / 2;
        },

        highlight: function(zr) {
            this._outlineShape.style.strokeColor = this.highlightColor;
            this._glowShape.ignore = false;
            if (this.image && this._labelShape) {
                this._labelShape.style.color = this.highlightLabelColor;
            }
            this._outlineShape.style.z = 12;
            this._glowShape.style.z = 11.5;
            this._imageShape.style.z = 11;
            if (this._labelShape) {
                this._labelShape.style.z = 11;
            }
            this._shadowShape.style.z = 10.9;

            zr.modGroup(this.group);
        },

        leaveHighlight: function(zr) {
            this._outlineShape.style.strokeColor = this.color;
            this._glowShape.ignore = true;
            if (this.image && this._labelShape) {
                this._labelShape.style.color = this.labelColor;
            }
            this._outlineShape.style.z = 2;
            this._glowShape.style.z = 1.5;
            this._imageShape.style.z = 1;
            if (this._labelShape) {
                this._labelShape.style.z = 1;
            }
            this._shadowShape.style.z = 0.9;

            zr.modGroup(this.group);
        }
    });

    return NodeEntity;
});