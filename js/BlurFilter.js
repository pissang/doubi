define(function(require) {

    var Base = require('qtek/core/Base');
    var Renderer = require('qtek/Renderer');
    var Compositor = require('qtek/compositor/Compositor');
    var FilterNode = require('qtek/compositor/Node');
    var SceneNode = require('qtek/compositor/SceneNode');
    var Texture2D = require('qtek/texture/Texture2D');
    var Texture = require('qtek/Texture');
    var Scene = require('qtek/Scene');
    var OrthoCamera = require('qtek/camera/Orthographic');
    var Plane = require('qtek/geometry/Plane');
    var Shader = require('qtek/Shader');
    var Material = require('qtek/Material');
    var Mesh = require('qtek/Mesh');
    var Shader = require('qtek/Shader');
    var FrameBuffer = require('qtek/FrameBuffer');
    var shaderLibrary = require('qtek/shader/library');

    var screenSize = require('./screenSize');

    var planeGeo = new Plane();
    var planeShader = new Shader({
        vertex: Shader.source('buildin.basic.vertex'),
        fragment: Shader.source('buildin.basic.fragment')
    });
    planeShader.enableTexture('diffuseMap');
    planeShader.define('fragment', 'DIFFUSEMAP_ALPHA_ALPHA');

    var BlurFilter = Base.derive(function() {
        return {
        
            _textureStack: [],

            _rttStack: [],

            canvas: null,

            scale: 1,

            scaleRatio: 0.8,

            blurSize: 3,

            blurRepeat: 5,

            _sceneNode: null,

            _compositor: null,

            _renderer: null,

            _blurNodes: [],

            _meshBack: null,
            _meshFront: null,

            _frameBuffer: new FrameBuffer(),

            notSupportWebGL: false
        }
    }, function() {
        var renderer = new Renderer({
            canvas: this.canvas,
            devicePixelRatio: 1
        });
        this._renderer = renderer;
        
        var compositor = new Compositor();
        this._compositor = compositor;

        var scene = new Scene();
        var camera = new OrthoCamera();
        camera.position.z = 2;
        camera.far = 100;

        this._meshBack = new Mesh({
            name: 'BACK',
            geometry: planeGeo,
            material: new Material({
                shader: planeShader,
                // TODO 不加 transparent 图片中的线条不能透明了
                transparent: true,
                depthMask : false
            })
        });
        this._meshBack.position.z = -1;

        this._meshFront = new Mesh({
            name: 'FRONT',
            geometry: planeGeo,
            material: new Material({
                shader: planeShader,
                // TODO 不加 transparent 图片中的线条不能透明了
                transparent: true,
                depthMask : false
            })
        });
        this._meshFront.position.z = 0;

        scene.add(this._meshBack);
        scene.add(this._meshFront);

        var sceneNode = new SceneNode({
            name: 'scene',
            scene: scene,
            camera: camera,
            outputs: {
                color: {
                    parameters: {
                        width: function(renderer) {return renderer.width},
                        height: function(renderer) {return renderer.height},
                        // minFilter: Texture.NEAREST,
                        // magFilter: Texture.NEAREST
                    }
                }
            }
        });
        this._sceneNode = sceneNode;

        var blurNodeH, blurNodeV;

        for (var i = 0; i < this.blurRepeat; i++) {
            blurNodeH = new FilterNode({
                name: 'blur_h_' + i,
                shader: Shader.source('buildin.compositor.gaussian_blur_h'),
                inputs: {
                    texture: {
                        node: i == 0 ? "scene" : "blur_v_" + (i - 1),
                        pin: 'color'
                    }
                },
                outputs: {
                    color: {
                        parameters: {
                            width: function(renderer) {return renderer.width},
                            height: function(renderer) {return renderer.height},
                            // minFilter: Texture.NEAREST,
                            // magFilter: Texture.NEAREST
                        }
                    }
                }
            });
            blurNodeV = new FilterNode({
                name: 'blur_v_' + i,
                shader: Shader.source('buildin.compositor.gaussian_blur_v'),
                inputs: {
                    texture: {
                        node: "blur_h_" + i,
                        pin: 'color'
                    }
                },
                outputs: {
                    color: {
                        parameters: {
                            width: function(renderer) {return renderer.width},
                            height: function(renderer) {return renderer.height},
                            // minFilter: Texture.NEAREST,
                            // magFilter: Texture.NEAREST
                        }
                    }
                }
            });

            this._blurNodes.push(blurNodeH);
            this._blurNodes.push(blurNodeV);
        }
        // Last node
        if (blurNodeV) {
            blurNodeV.outputs = null;
        }

        compositor.addNode(sceneNode);

        for (var i = 0; i < this._blurNodes.length; i++) {
            compositor.addNode(this._blurNodes[i]);
        }
    }, {

        addImage: function(image) {
            var texture = new Texture2D({
                image: image,
                // minFilter: Texture.NEAREST,
                // magFilter: Texture.NEAREST
            });
            texture.getWebGLTexture(this._renderer.gl);

            // Add previus scene to a rtt
            if (this._textureStack.length > 0) {
                // TODO
                // var rtt = new Texture2D({
                //     width: this._renderer.width,
                //     height: this._renderer.height
                // });
                // this.blurSize = 5.0;
                // this.scale = 1.0;

                // this._frameBuffer.attach(this._renderer.gl, rtt);
                // this.render(this._frameBuffer);

                // this._rttStack.push(rtt);

                // this._meshBack.material.set('diffuseMap', rtt);
            }

            this._meshFront.material.set('diffuseMap', texture);
            this._textureStack.push(texture);
        },

        popImage: function() {
            var tex = this._textureStack.pop();
            var rtt = this._rttStack.pop();
            if (tex) {
                this._renderer.disposeTexture(tex);
            }
            if (rtt) {
                this._renderer.disposeTexture(rtt);
            }
            this._meshBack.material.set('diffuseMap', this._rttStack[this._rttStack.length - 1] || null);
            this._meshFront.material.set('diffuseMap', this._textureStack[this._textureStack.length - 1] || null);
        },

        render: function(frameBuffer) {
            var renderer = this._renderer;
            for (var i = 0; i < this._blurNodes.length; i++) {
                this._blurNodes[i].setParameter('blurSize', this.blurSize);
                this._blurNodes[i].setParameter('textureWidth', renderer.width);
                this._blurNodes[i].setParameter('textureHeight', renderer.height);
            }

            var scale = this.scale;
            this._meshFront.visible = !!this._meshFront.material.get('diffuseMap');
            this._meshFront.scale.set(scale, scale, scale);
            scale *= this.scaleRatio;
            this._meshBack.visible = !!this._meshBack.material.get('diffuseMap');
            this._meshBack.scale.set(scale, scale, scale);

            this._compositor.render(renderer, frameBuffer);
            // frameBuffer && frameBuffer.bind(renderer);
            // renderer.render(this._sceneNode.scene, this._sceneNode.camera);
            // frameBuffer && frameBuffer.unbind(renderer);
        },

        resize: function() {
            var canvas = this._renderer.canvas;
            this._renderer.resize(screenSize.width(), screenSize.height());

            this.render();
        },

        clear: function() {
            var gl = this._renderer.gl;
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        }
    });

    return BlurFilter;
});