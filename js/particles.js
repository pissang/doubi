define(function(require) {

    var canvas = document.getElementById('bg-particles');

    var glMatrix = require('glmatrix');
    var vec2 = glMatrix.vec2;

    var ctx = canvas.getContext('2d');

    function generateSprite(){
        var size = 16;

        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(size/2, size/2, 60, 0, Math.PI * 2, false) ;
        ctx.closePath();

        var gradient = ctx.createRadialGradient(
            size/2, size/2, 0, size/2, size/2, size/2
        );
        gradient.addColorStop(0, 'rgba(77, 206, 255,1)');
        gradient.addColorStop(0.4, 'rgba(77,1206,255,1)');
        gradient.addColorStop(1.0, 'rgba(77,1206,255,0.0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        return canvas;
    }

    var particles = [];
    var pool = [];

    var sprite = generateSprite();

    function Particle() {
        this.p = vec2.create();
        this.v = vec2.create();
        this.size = 1;
        this.life = 0;
        this.opacity = 1;
        this.age = 0;
    }

    Particle.prototype.init = function() {
        this.size = Math.random() * 10;
        this.p[0] = Math.random() * canvas.width
        this.p[1] = Math.random() * canvas.height;
        this.v[0] = Math.random();
        this.v[1] = Math.random();

        this.life = 4000 * Math.random() + 2000;
        this.age = 0;
    }

    Particle.prototype.update = function(frameTime) {
        vec2.scaleAndAdd(this.p, this.p, this.v, frameTime * 0.01);
        var percent = this.age / this.life;
        if (percent < 0.3) {
            this.opacity = percent;
        } else {
            this.opacity = 1 - percent;
        }
        this.age += frameTime;
    }

    function start() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        for (var i = 0; i < 600; i++) {
            pool.push(new Particle());
        }

        for (var i = 0; i < 50; i++) {
            emit();
        }
    }

    function emit() {
        if (pool.length > 2) {
            for (var i = 0; i < 2; i++) {
                var p = pool.pop();
                p.init();
                particles.push(p);
            }   
        }
    }

    function frame(frameTime) {
        emit();

        var len = particles.length;
        for (var i = 0; i < len;) {
            var p = particles[i];
            p.update(frameTime);
            if (p.age > p.life) {
                particles[i] = particles[len-1];
                particles.pop();
                pool.push(p);
                len--;
            } else {
                i++;
            }
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < len; i++) {
            var p = particles[i];
            ctx.globalAlpha = p.opacity;
            ctx.drawImage(sprite, p.p[0], p.p[1], p.size, p.size);
        }
    }

    return {
        start: start,
        frame: frame
    }
})