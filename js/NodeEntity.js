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

        lineWidth: 3,

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

        _clipShape: null

    }, function() {

        this.group = new Group();
        this.shapeList = [];

        var self = this;

        var outlineShape = new CircleShape({
            style: new CircleStyle({
                strokeColor: this.color,
                r: this.radius,
                lineWidth: this.lineWidth,
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
        var shadowShape = new CircleShape({
            style: new CircleStyle({
                color: 'black',
                r: this.radius,
                brushType: 'fill',
                shadowColor: 'black',
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowOffsetY: 0
            }),
            z: 0.9,
            zlevel: this.level,
            hoverable: false
        });
        this.group.addChild(shadowShape);
        this.group.addChild(outlineShape);
        
        var contentGroup = new Group();
        var clipShape = new CircleShape({
            style: new CircleStyle({
                r: this.radius
            })
        });
        contentGroup.clipShape = clipShape;

        var imageShape = new ImageShape({
            style: {
                image: this.image || textNodeBG,
                x: -this.radius,
                y: -this.radius,
                width: this.radius * 2,
                height: this.radius * 2
            },
            hoverable: false,
            z: 1,
            zlevel: this.level
        });

        if (this.label) {
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
                    textColor: 'white',
                    textFont: '14px 微软雅黑'
                },
                hoverable: false,
                z: 1,
                zlevel: this.level
            });

            if (!this.image) {
                labelShape.style.x = -this.radius;
                labelShape.style.y = -this.radius;
                labelShape.style.width = this.radius * 2;
                labelShape.style.height = this.radius * 2;

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

        this.shapeList.push(this._imageShape);

        if (this._labelShape) {
            this.shapeList.push(this._labelShape);
        }
        
        this.shapeList.push(this._outlineShape);
    }, {

        update: function(zr) {
            this._outlineShape.style.r = this.radius;

            this._imageShape.style.x = -this.radius;
            this._imageShape.style.y = -this.radius;
            this._imageShape.style.width = this.radius * 2;
            this._imageShape.style.height = this.radius * 2;

            this._clipShape.style.r = this.radius;

            if (this._labelShape) {
                if (this.image) {
                    this._labelShape.style.x = -this.radius;
                    this._labelShape.style.y = this.radius - 20;
                    this._labelShape.style.width = this.radius * 2;
                } else {
                    this._labelShape.style.x = -this.radius;
                    this._labelShape.style.y = -this.radius;
                    this._labelShape.style.width = this.radius * 2;
                    this._labelShape.style.height = this.radius * 2;
                }
            }

            zr.modShape(this._outlineShape.id);
            zr.modShape(this._labelShape.id);
            zr.modShape(this._imageShape.id);

            zr.modGroup(this.group.id);
        },

        highlight: function() {
            this._outlineShape.style.strokeColor = this.highlightColor;

            if (this.image && this._labelShape) {
                this._labelShape.style.color = this.highlightLabelColor;
            }
        },

        leaveHighlight: function() {
            this._outlineShape.style.strokeColor = this.color;

            if (this.image && this._labelShape) {
                this._labelShape.style.color = this.labelColor;
            }
        }
    });

    return NodeEntity;
});