define(function(require) {

    // Perlin noise
    var zrender = require('zrender');
    var CircleShape = require('zrender/shape/Circle');
    var vec2 = require('zrender/tool/vector');

    var noise = require('./perlin');
    noise.seed(Math.random());

    var speeds = [];
    for (var i = 0; i < 32; i++) {
        for (var j = 0; j < 32; j++) {
            var x = noise.perlin2(i / 16, j / 16);
            var y = noise.perlin2(i / 8, j / 8);
            speeds[j * 32 + i] = [x, y];
        }
    }

    var width, height;

    var Particle = function(r) {
        
        var x = (Math.random() - 0.5) * width / 1.4 + width / 2;
        var y = (Math.random() - 0.5) * height / 1.4 + height / 2;

        this.shape = new CircleShape({
            style: {
                x: 0,
                y: 0,
                r: r,
                lineWidth: r,
                brushType: 'both',
                color: '#8c72d4',
                strokeColor: 'rgba(140, 114, 212, 0.5)',
                opacity: 0.3
            },
            highlightStyle: {
                opacity: 0
            },
            position: [x, y],
            zlevel: -1
        });

        this.step = Math.round(speeds.length * Math.random());
    }

    Particle.prototype.update = function(zr, frameTime) {
        var speed = speeds[Math.round(this.step) % speeds.length];
        vec2.scaleAndAdd(this.shape.position, this.shape.position, speed, frameTime / 40);
        zr.modShape(this.shape.id);
        this.step += 0.1;
    }

    var particles = [];

    // 简单的背景点缀
    var start = function(_zr) {
        zr = _zr;
        width = window.innerWidth;
        height = window.innerHeight;
        for (var i = 0; i < 8; i++) {
            var particle = new Particle(Math.random() * 20 + 10);
            particles.push(particle);

            zr.addShape(particle.shape);
        }
    };

    var frame = function(zr, frameTime) {
        for (var i = 0; i < particles.length; i++) {
            particles[i].update(zr, frameTime);
        }
        zr.refreshNextFrame();
    }

    return {
        start: start,
        frame: frame,
        resize: function() {
            var nw = window.innerWidth;
            var nh = window.innerHeight;
            for (var i = 0; i < particles.length; i++) {
                particles[i].shape.position[0] *= nw / width;
                particles[i].shape.position[1] *= nh / height;
            }
            width = nw;
            height = nh;
        }
    }
});