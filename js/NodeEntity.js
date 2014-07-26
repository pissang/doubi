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

    var NodeEntity = Base.derive({
        
        group: null,

        visible: true,

        alpha: 1,

        lineWidth: 4,

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
        _imageShape: null

    }, function() {

        this.group = new Group();
        this.shapeList = [];

        var self = this;

        var outlineShape = new CircleShape({
            style: new CircleStyle({
                color: this.color,
                r: this.radius + this.lineWidth,
                brushType: 'both',
                shadowColor: 'black',
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowOffsetY: 0
            }),
            highlightStyle: {
                opacity: 0
            },
            z: 1,
            zlevel: this.level
        });
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
                image: this.image,
                x: -this.radius,
                y: -this.radius,
                width: this.radius * 2,
                height: this.radius * 2
            },
            clickable: true,
            onclick: function() {
                self.trigger('click');
            },
            onmouseover: function() {
                self.trigger('hover');
            },
            highlightStyle: {
                opacity: 0
            },
            z: 1,
            zlevel: this.level
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
            z: 1,
            zlevel: this.level
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
        
        highlight: function() {
            this._outlineShape.style.color = this.highlightColor;
            this._labelShape.style.color = this.highlightLabelColor;
        },

        leaveHighlight: function() {
            this._outlineShape.style.color = this.color;
            this._labelShape.style.color = this.labelColor;
        }
    });

    return NodeEntity;
});