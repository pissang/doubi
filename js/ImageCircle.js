define(
    function (require) {
        var Base = require('zrender/shape/Base');

        var idx = 0;

        function ImageCircle(options) {
            Base.call(this, options);

            this._idx_ = Math.random() < 0.7 ? 1 : 0
        }

        var circleBG = [new Image(), new Image()];
        circleBG[0].src = 'imgs/circle.png';
        circleBG[1].src = 'imgs/circle2.png';

        ImageCircle.prototype = {
            type: 'circle',
            /**
             * 创建圆形路径
             * @param {Context2D} ctx Canvas 2D上下文
             * @param {Object} style 样式
             */
            buildPath : function (ctx, style) {
                ctx.arc(style.x, style.y, style.r, 0, Math.PI * 2, true);
                return;
            },

            brush: function(ctx, isHighlight) {
                var style = this.style;
                if (style.opacity < 0.01) {
                    return;
                }

                if (this.brushTypeOnly) {
                    style.brushType = this.brushTypeOnly;
                }

                if (isHighlight) {
                    // 根据style扩展默认高亮样式
                    style = this.getHighlightStyle(
                        style,
                        this.highlightStyle || {},
                        this.brushTypeOnly
                    );
                }

                if (this.brushTypeOnly == 'stroke') {
                    style.strokeColor = style.strokeColor || style.color;
                }

                ctx.save();
                this.setContext(ctx, style);

                // 设置transform
                this.updateTransform(ctx);

                ctx.beginPath();
                this.buildPath(ctx, style);
                if (this.brushTypeOnly != 'stroke') {
                    ctx.closePath();
                }

                switch (style.brushType) {
                    case 'both':
                        ctx.fill();
                    case 'stroke':
                        style.lineWidth > 0 && ctx.stroke();
                        break;
                    default:
                        ctx.fill();
                }
                if(style.image) {
                    ctx.clip();
                    ctx.drawImage(style.image, style.x - style.r, style.y - style.r, style.r * 2, style.r * 2);
                } else if (style.haveBackground) {
                    ctx.clip();
                    ctx.drawImage(circleBG[this._idx_ % 2], style.x - style.r, style.y - style.r, style.r * 2, style.r * 2);
                }

                if (style.text) {
                    this.drawText(ctx, style, this.style);
                }

                ctx.restore();
            },

            /**
             * 返回矩形区域，用于局部刷新和文字定位
             * @param {Object} style
             */
            getRect : function (style) {
                if (style.__rect) {
                    return style.__rect;
                }
                
                var lineWidth;
                if (style.brushType == 'stroke' || style.brushType == 'fill') {
                    lineWidth = style.lineWidth || 1;
                }
                else {
                    lineWidth = 0;
                }
                style.__rect = {
                    x : Math.round(style.x - style.r - lineWidth / 2),
                    y : Math.round(style.y - style.r - lineWidth / 2),
                    width : style.r * 2 + lineWidth,
                    height : style.r * 2 + lineWidth
                };
                
                return style.__rect;
            }
        };

        require('zrender/tool/util').inherits(ImageCircle, Base);
        return ImageCircle;
    }
);