define(function(require) {

    var canvas = document.getElementById('bg-particles');

    var ParticleRenderable = require('qtek/particleSystem/ParticleRenderable');
    var Emitter = require('qtek/particleSystem/Emitter');
    var Renderer = require('qtek/Renderer');
    var PerspectiveCamera = require('qtek/camera/Perspective');
    var Scene = require('qtek/Scene');
    var Vector3 = require('qtek/math/Vector3');
    var Texture2D = require('qtek/texture/Texture2D');
    var easing = require('qtek/animation/easing');

    var vec4 = require('glmatrix').vec4;

    var renderer;
    var camera;
    var scene;

    var particleRenderable;

    function generateSprite(size) {
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, 60, 0, Math.PI * 2, false);
        ctx.closePath();

        var gradient = ctx.createRadialGradient(
                size/2, size/2, 0, size/2, size/2, size/2
        );
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.3, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.8, 'rgba(255,255,255,0.51)');
        gradient.addColorStop(1.0, 'rgba(255,255,255,0.0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        return canvas;
    }

    function generateGradient() {
        var canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 10;
        var ctx = canvas.getContext('2d');

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

        var c1 = [46, 95, 208, 1.0];
        var c2 = [221, 71, 5, 0.3];
        var c = [];

        gradient.addColorStop(0, 'rgba(' + c1.join(',') + ')');
        var steps = 3;
        for (var i = 0; i < steps; i++) {
            var p = (i+1) / (steps+1);
            vec4.lerp(c, c1, c2, easing.CubicInOut(p));
            c[3] = Math.random();
            for (var j = 0; j < 3; j++) {
                c[j] = Math.round(c[j]);
            }
            gradient.addColorStop(p, 'rgba(' + c.join(',') + ')');
        }
        gradient.addColorStop(1, 'rgba(' + c2.join(',') + ')');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    }

    function start() {
         renderer = new Renderer({
            canvas: canvas
        });
        renderer.resize(window.innerWidth, window.innerHeight);
        scene = new Scene();
        camera = new PerspectiveCamera({
            aspect: renderer.width / renderer.height
        });
        camera.position.z = 100;

        particleRenderable = new ParticleRenderable();

        var emitter1 = new Emitter({
            max: 1000,
            amount: 4,
            life: Emitter.random1D(2, 4),
            spriteSize: Emitter.constant(400 * (window.devicePixelRatio || 1)),
            position: Emitter.random3D(
                new Vector3(-100, -80, 60),
                new Vector3(100, 0, -60)
            ),
            velocity: Emitter.random3D(
                new Vector3(-3, 3, -3),
                new Vector3(3, 4, 3)
            )
        });
        var emitter2 = new Emitter({
            max: 1000,
            amount: 3,
            life: Emitter.random1D(2, 4),
            spriteSize: Emitter.constant(400 * (window.devicePixelRatio || 1)),
            position: Emitter.random3D(
                new Vector3(-100, 0, 60),
                new Vector3(100, 40, -60)
            ),
            velocity: Emitter.random3D(
                new Vector3(-3, 2, -3),
                new Vector3(3, 2, 3)
            )
        });
        particleRenderable.addEmitter(emitter1);
        particleRenderable.addEmitter(emitter2);
        particleRenderable.material.set('color', [2, 2, 2]);
        particleRenderable.material.shader.enableTexture('sprite');
        particleRenderable.material.shader.enableTexture('gradient');

        particleRenderable.material.blend = function(_gl){
            _gl.blendEquation(_gl.FUNC_ADD);
            _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE);
        }

        var sprite = generateSprite(32);
        var gradient = generateGradient();

        particleRenderable.material.set('sprite', new Texture2D({
            image: sprite
        }));
        particleRenderable.material.set('gradient', new Texture2D({
            image: gradient
        }));

        // document.body.appendChild(sprite);
        // document.body.appendChild(gradient);

        scene.add(particleRenderable);
    }

    function frame(deltaTime) {
        particleRenderable.updateParticles(deltaTime);
        renderer.render(scene, camera);
    }

    function resize() {
        renderer.resize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = renderer.width / renderer.height;
    }

    return {
        start: start,
        frame: frame,
        resize: resize
    }
})