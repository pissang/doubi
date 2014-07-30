(function() {

    'use strict';

    var stopped = false;

    window.stopLoading = function() {
        if (tip) {
            document.body.removeChild(tip);
            document.body.removeChild(canvas);   
        }

        stopped = true;
    }

    var canvas = document.createElement('canvas');
    var backCanvas = document.createElement('canvas');
    if (!canvas.getContext) {
        return;
    }

    var devicePixelRatio = window.devicePixelRatio || 1;

    var size = 100;

    backCanvas.width = canvas.width = size * devicePixelRatio;
    backCanvas.height = canvas.height = size * devicePixelRatio;

    canvas.style.position = 'absolute';
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.style.left = (window.innerWidth / 2 - size / 2) + 'px';
    canvas.style.top = (window.innerHeight / 2 - size / 2) + 'px';
    canvas.style.id = 'loading-canvas';

    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    var backCtx = backCanvas.getContext('2d');

    var requestAnimationFrame = window.requestAnimationFrame
                                || window.msRequestAnimationFrame
                                || window.mozRequestAnimationFrame
                                || window.webkitRequestAnimationFrame
                                || function(func){setTimeout(func, 16);};


    var time = 0;
    var x = 0;
    var y = 0;

    var r0 = 5;
    var r1 = size / 2 - r0;

    ctx.scale(devicePixelRatio, devicePixelRatio);
    backCtx.scale(devicePixelRatio, devicePixelRatio);

    function draw() {
        if (stopped) {
            return;
        }

        time += 0.1;
        x = size / 2 + r1 * Math.cos(time);
        y = size / 2 + r1 * Math.sin(time);

        backCtx.globalCompositeOperation = 'copy';
        backCtx.drawImage(canvas, 0, 0, size, size);

        ctx.clearRect(0, 0, size, size);
        ctx.globalAlpha = 0.9;
        ctx.drawImage(backCanvas, 0, 0, size, size);

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#ff00c7';
        ctx.beginPath();
        ctx.arc(x, y, r0, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(draw);
    }

    var tip = document.createElement('tip');
    tip.id = 'loading-tip';
    tip.style.position = 'absolute';
    tip.style.width = size + 'px';
    tip.style.height = size + 'px';
    tip.style.left = (window.innerWidth / 2 - size / 2) + 'px';
    tip.style.top = (window.innerHeight / 2 - size / 2) + 'px';
    tip.style.textAlign = 'center';
    tip.style.lineHeight = size + 'px';
    tip.style.color = 'white';
    tip.innerHTML = '加载中';
    document.body.appendChild(tip);

    requestAnimationFrame(draw);

})();