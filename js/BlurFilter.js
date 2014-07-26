define(function(require) {

    var Base = require('qtek/core/Base');
    var Renderer = require('qtek/Renderer');
    var Compositor = require('qtek/compositor/Compositor');
    var FilterNode = require('qtek/compositor/Node');
    var SceneNode = require('qtek/compositor/SceneNode');
    var Texture2D = require('qtek/texture/Texture2D');
    var Scene = require('qtek/Scene');
    var OrthoCamera = require('qtek/camera/Orthographic');
    var Plane = require('qtek/geometry/Plane');
    var Shader = require('qtek/Shader');
    var Material = require('qtek/Material');
    var Mesh = require('qtek/Mesh');
    var Shader = require('qtek/Shader');

    var planeGeo = new Plane();
    var planeShader = new Shader({
        vertex: Shader.source('buildin.basic.vertex'),
        fragment: Shader.source('buildin.basic.fragment')
    });
    planeShader.enableTexture('diffuseMap');
    planeShader.define('fragment', 'DIFFUSEMAP_ALPHA_ALPHA');

    var BlurFilter = Base.derive({
        
        _imageMeshes: [],

        canvas: null,

        scale: 1,

        scaleRatio: 0.8,

        blurSize: 3,

        blurRepeat: 3,

        _sceneNode: null,

        _compositor: null,

        _renderer: null,

        _blurNodes: null

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
        camera.position.z = -1;

        var sceneNode = new SceneNode({
            name: 'scene',
            scene: scene,
            camera: camera,
            color: {
                parameters: {
                    width: function(renderer) {return renderer.width},
                    height: function(renderer) {return renderer.height}
                }
            },
            outputs: {
                color: {
                    parameters: {
                        width: function(renderer) {return renderer.width},
                        height: function(renderer) {return renderer.height}
                    }
                }
            }
        });
        this._sceneNode = sceneNode;

        this._blurNodes = [];
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
                            height: function(renderer) {return renderer.height}
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
                            height: function(renderer) {return renderer.height}
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
                image: image
            });
            var mesh = new Mesh({
                geometry: planeGeo,
                material: new Material({
                    shader: planeShader
                })
            });
            mesh.material.set('diffuseMap', texture);

            this._imageMeshes.push(mesh);

            this._sceneNode.scene.add(mesh);
        },

        popImage: function() {
            var mesh = this._imageMeshes.pop();
            if (mesh) {
                this._sceneNode.scene.remove(mesh);
                this._renderer.disposeTexture(mesh.material.get('diffuseMap'));
            }
        },

        render: function() {
            var renderer = this._renderer;
            for (var i = 0; i < this._blurNodes.length; i++) {
                this._blurNodes[i].setParameter('blurSize', this.blurSize);
                this._blurNodes[i].setParameter('textureWidth', renderer.width);
                this._blurNodes[i].setParameter('textureHeight', renderer.height);
            }

            var scale = this.scale;
            var z = 0;
            for (var i = 0; i < this._imageMeshes.length; i++) {
                var mesh = this._imageMeshes[i];
                mesh.scale.set(scale, scale, scale);
                scale *= this.scaleRatio;
                mesh.position.z = z++;
            }

            this._compositor.render(renderer);
            // renderer.render(this._sceneNode.scene, this._sceneNode.camera);
        }
    });

    return BlurFilter;
});