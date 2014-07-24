define(function(require) {

    var zrender = require('zrender');
    var Matrix4 = require('qtek/math/Matrix4');
    var Camera = require('qtek/camera/Perspective');
    var Node3D = require('qtek/Node');

    var notifier = require('qtek/core/mixin/notifier');
    var qtekUtil = require('qtek/core/util');

    var CanvasRenderer = function(dom) {
        
        this.zr = zrender.init(dom);

        this.root = new Node3D();

        this.camera = new Camera();

        this._renderables = [];

        this._needsRender = false;

        var self = this;

        this.zr.animation.onframe = function(frameTime) {
            self._frame(frameTime);
        }
    }

    CanvasRenderer.prototype.add = function(node) {
        this.root.add(node);

        this.zr.addGroup(node.group);
    }

    CanvasRenderer.prototype.remove = function(node) {
        this.root.remove(node);
        node.zr = null;
        
        this.zr.delGroup(node.group);
    }

    CanvasRenderer.prototype._frame = function(frameTime) {
        if (this._needsRender) {
            this.update();
            this.zr.render();
        }
        
        this._needsRenfresh = false;
        this._needsRender = false;

        this.trigger('frame', frameTime);
    }

    CanvasRenderer.prototype.render = function() {
        this._needsRender = true;
    }

    CanvasRenderer.prototype.resize = function() {
        this.zr.resize();
    }

    CanvasRenderer.prototype.update = function() {
        this.root.update(true);

        this.camera.update(true);

        this._offset = 0;

        this._updateRenderables(this.root);

        this._projectShapes();

        this.trigger('afterupdate');
    }

    CanvasRenderer.prototype._updateRenderables = function(node) {
        if (node.projectShape) {
            this._renderables[this._offset++] = node;
        }
        for (var i = 0; i < node._children.length; i++) {
            this._updateRenderables(node._children[i]);
        }
    }

    CanvasRenderer.prototype._projectShapes = (function() {

        var worldViewProjection = new Matrix4();
        var worldView = new Matrix4();

        return function() {
            for (var i = 0; i < this._renderables.length; i++) {
                var renderable = this._renderables[i];

                Matrix4.multiply(worldView, this.camera.viewMatrix, renderable.worldTransform);
                // Matrix4.multiply(worldViewProjection, this.camera.projectionMatrix, worldView);

                renderable.projectShape(worldView, this.zr);

                for (var j = 0; j < renderable.shapeList.length; j++) {
                    this.zr.modShape(renderable.shapeList[j].id);
                }
            }
        }
    })();

    qtekUtil.extend(CanvasRenderer.prototype, notifier);

    return CanvasRenderer;

});