define(function(require) {

    var Node = require('qtek/Node');
    var Matrix4 = require('qtek/math/Matrix4');

    var matrix = new Matrix4();
    var node = new Node();

    var Gallery = function(list) {

        this.list = list || [];

        var root = document.createElement('div');
        root.className = 'gallery-root';

        this.root = root;

        this.domList = [];

        this._rowOffsets = [];

        this.init();
    }

    var epsilon = function ( value ) {
        return Math.abs( value ) < 0.000001 ? 0 : value;
    };

    var getObjectCSSMatrix = function ( matrix ) {

        var els = matrix._array;

        return 'translate3d(-50%,-50%,0) matrix3d(' +
            epsilon( els[ 0 ] ) + ',' +
            epsilon( els[ 1 ] ) + ',' +
            epsilon( els[ 2 ] ) + ',' +
            epsilon( els[ 3 ] ) + ',' +
            epsilon( els[ 4 ] ) + ',' +
            epsilon( els[ 5 ] ) + ',' +
            epsilon( els[ 6 ] ) + ',' +
            epsilon( els[ 7 ] ) + ',' +
            epsilon( els[ 8 ] ) + ',' +
            epsilon( els[ 9 ] ) + ',' +
            epsilon( els[ 10 ] ) + ',' +
            epsilon( els[ 11 ] ) + ',' +
            epsilon( els[ 12 ] ) + ',' +
            epsilon( els[ 13 ] ) + ',' +
            epsilon( els[ 14 ] ) + ',' +
            epsilon( els[ 15 ] ) +
        ')';

    };


    Gallery.prototype.init = function() {
        var self = this;

        var R = 150;
        var nRow = 6;

        var root = this.root;

        var idx = 0;

        for (var k = 2; k < nRow - 1; k++) {
            var theta = (k - nRow / 2) * Math.PI / nRow;

            this._rowOffsets.push(0);

            var r0 = Math.cos(theta) * R;
            var perimeter = r0 * Math.PI * 2;

            // var steps = perimeter / (R * 2 * Math.PI / 8);
            var steps = 7;

            for (var i = 0; i < steps; i ++) {

                if (steps == 1) {
                    var phi = 0;
                } else {
                    var phi = i / steps * Math.PI * 2;
                }

                var x = r0 * Math.sin(phi);
                var z = r0 * Math.cos(phi);
                var y = R * Math.sin(theta);

                var plane = document.createElement('div');
                plane.className = 'gallery-item';

                node.position.set(x, y, z);
                node.rotation.identity();
                node.rotation.rotateY(phi);
                node.rotation.rotateX(-theta);

                node.update(true);

                matrix.copy(node.worldTransform);

                var transform = getObjectCSSMatrix(matrix);
                plane.style.transform = transform;
                plane.style.WebkitTransform = transform;

                var item = this.list[idx % this.list.length];
                idx++;

                if (item) {
                    if (item.title) {
                        var h5 = document.createElement('h5');
                        h5.innerHTML = item.title;
                        plane.appendChild(h5);
                    }
                    if (item.image) {
                        var img = document.createElement('img');
                        img.src = item.image;

                        var $a = $('<a data-lightbox="事件" href="' + item.image + '" data-title="' + item.description + '"></a>');
                        $a.append(img);
                        $(plane).append($a);
                    }
                }

                root.appendChild(plane);

                this.domList.push(plane);
            }
        }
    }

    Gallery.prototype.update = function(deltaTime) {

        var R = 150;
        var nRow = 6;

        var root = this.root;

        var idx = 0;

        var cRow = 0;

        for (var k = 2; k < nRow - 1; k++) {
            var theta = (k - nRow / 2) * Math.PI / nRow;

            this._rowOffsets[cRow] += k % 2 == 0 ? deltaTime / 10000 : -deltaTime / 10000;
            var offset = this._rowOffsets[cRow];
            cRow++;

            var r0 = Math.cos(theta) * R;
            var perimeter = r0 * Math.PI * 2;

            // var steps = perimeter / (R * 2 * Math.PI / 8);
            var steps = 7;

            for (var i = 0; i < steps; i ++) {

                if (steps == 1) {
                    var phi = 0;
                } else {
                    var phi = i / steps * Math.PI * 2;
                }
                phi = (phi + offset) % Math.PI * 2;

                var x = r0 * Math.sin(phi);
                var z = r0 * Math.cos(phi);
                var y = R * Math.sin(theta);

                var plane = this.domList[idx++];

                node.position.set(x, y, z);
                node.rotation.identity();
                node.rotation.rotateY(phi);
                node.rotation.rotateX(-theta);

                node.update(true);

                matrix.copy(node.worldTransform);

                var transform = getObjectCSSMatrix(matrix);
                plane.style.transform = transform;
                plane.style.WebkitTransform = transform;
            }
        }
    }

    return Gallery
});