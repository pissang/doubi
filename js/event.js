define(function(require) {

    var Gallery = require('./Gallery');
    var Circle3D = require('./Circle3D');

    var circle;
    var gallery;

    var leaveCircle;

    var stage;
    var animation;

    var animating = false;

    function show(_stage, _animation, list) {
        if (animating) {
            return;
        }
        animating = true;

        stage = _stage;
        animation = _animation;

        if (gallery) {
            if (gallery.root.parentNode) {
                gallery.root.parentNode.removeChild(gallery.root);
            }
        }

        var width = stage.zr.getWidth();
        var height = stage.zr.getHeight();

        if (!circle) {
            circle = new Circle3D({
                zr: stage.zr,
                bleeding: true
            });
            circle.shape.zlevel = 2;

            var img = new Image();
            circle.shape.style.image = img;
            img.src = 'imgs/event.png';

            circle.shape.style.shadowBlur = 40;
            circle.shape.style.shadowColor = '#6ed6ea';
            circle.shape.style.shadowOffsetX = 0;
            circle.shape.style.shadowOffsetY = 0;
            
            circle.shape.highlightStyle = {
                opacity: 0
            }
            circle.shape.style.lineWidth = 2;

            circle.position.z = -1.8;
            circle.position.x = width / 2;
            circle.position.y = height / 2;

            stage.root.add(circle);
        }
        if (!leaveCircle) {
            leaveCircle = new Circle3D({
                zr: stage.zr,
                bleeding: true
            });

            var img = new Image();
            leaveCircle.shape.style.image = img;
            img.src = 'imgs/worldcup.png';
            leaveCircle.shape.zlevel = 2;

            leaveCircle.shape.highlightStyle = {
                opacity: 0
            }

            leaveCircle.position.x = -500;
            leaveCircle.position.y = -250;
            leaveCircle.position.z = 0.8;

            circle.add(leaveCircle);

            leaveCircle.shape.clickable = true;
            leaveCircle.shape.onclick = leave;
            window.leave = leave;
        }

        circle.fadeIn();
        leaveCircle.shape.hidden = false;

        circle.startBleeding(0);
        leaveCircle.startBleeding(0);

        animation.animate(stage.camera.position)
            .when(2000, {
                z: -2
            })
            .during(function() {
                stage.refresh();
            })
            .done(function() {
                gallery = new Gallery(list);
                document.body.appendChild(gallery.root);
                stage.on('frame', update);

                animating = false;
            })
            .start('CubicOut');
        
        document.getElementById('cover').style.opacity = 1.0;
    }

    function update(deltaTime) {
        if (gallery) {
            gallery.update(deltaTime);
        }
    }

    function leave() {
        if (animating) {
            return;
        }
        animating = true;

        stage.off('frame', update);

        if (gallery && gallery.root.parentNode) {
            gallery.root.parentNode.removeChild(gallery.root);
        }

        gallery = null;
        
        circle.fadeOut();
        leaveCircle.shape.hidden = true;

        animation.animate(stage.camera.position)
            .when(1000, {
                z: 0
            })
            .during(function() {
                stage.refresh();
            })
            .done(function() {
                animating = false;
            })
            .start('CubicIn');

        if (circle) {
            circle.stopBleeding();
            leaveCircle.stopBleeding();
        }

        document.getElementById('cover').style.opacity = 0;
    }

    return {
        show: show,
        leave: leave
    }
});
