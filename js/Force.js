define(function(require) {

    var glMatrix = require('glmatrix');
    var vec2 = glMatrix.vec2;

    var Node = function(name, radius, position, fixed) {
        this.name = name;
        this.radius = radius;
        this.position = position || vec2.create();
        this.fixed = fixed || false;

        this.velocity = vec2.create();
        this.force = vec2.create();
    }

    var Link = function(source, target) {
        this.source = source;
        this.target = target;
    }

    function Force(opts) {

        opts = opts || {};

        this.nodes = [];

        this.links = [];

        this.width = opts.width || 0;
        this.height = opts.height || 0;

        this._nodesMap = {};
    }

    Force.prototype.addNode = function(name, radius, position, fixed) {
        if (!position) {
            position = ve2.fromValues(width * Math.random(), height * Math.random());
        }
        var node = new Node(name, radius, position, fixed);

        this._nodesMap[name] = node;
        this.nodes.push(node);

        return node;
    }

    Force.prototype.removeNode = function(node) {
        var len = this.links.length;
        for (var i = 0; i < len;) {
            var link = this.links[i];

            if (link.source == node || link.target == node) {
                this.links.splice(i, 1);
                len--;
            } else {
                i++;
            }
        }
    }

    Force.prototype.addLink = function(source, target) {
        if (typeof(source) == 'string') {
            source = this._nodesMap[source];
            target = this._nodesMap[target];
        }
        if (source && target) {
            var link = new Link(source, target);
            this.links.push(link);

            return link;
        }
    }

    Force.prototype.step = function(stepTime) {
        var len = this.nodes.length;

        var v12 = vec2.create();

        var area = this.width * this.height;
        var k = Math.sqrt(area / len);
        var k2 = k * k;

        // Nodes repulse force
        for (var i = 0; i < len; i++) {
            for (var j = i + 1; j < len; j++) {
                var n1 = this.nodes[i];
                var n2 = this.nodes[j];

                if (n1.fixed && n2.fixed) {
                    continue;
                }

                vec2.sub(v12, n2.position, n1.position);
                var d = vec2.len(v12);

                // Prevent overlap
                d -= n1.radius + n2.radius;

                if (d > 500) {
                    continue;
                }
                if (d < 5) {
                    d = 5;
                }

                var factor = k * k / d / d;

                if (!n1.fixed) {
                    vec2.scaleAndAdd(n1.force, n1.force, v12, -factor);
                }
                if (!n2.fixed) {
                    vec2.scaleAndAdd(n2.force, n2.force, v12, factor);   
                }
            }
        }

        var centroid = [this.width / 2, this.height / 2];
        for (var i = 0; i < len; i++){
            var node = this.nodes[i];
            if (node.fixed) {
                continue;
            }
            vec2.sub(v12, centroid, node.position);

            var d = vec2.len(v12);
            var factor = d / 200;
            vec2.scaleAndAdd(
                node.force, node.force, v12, factor
            );
        }

        // Nodes attraction force
        for (var i= 0; i < this.links.length; i++) {
            var link = this.links[i];
            var n1 = link.source;
            var n2 = link.target;

            if (n1.fixed && n2.fixed) {
                continue;
            }

            vec2.sub(v12, n2.position, n1.position);
            var d = vec2.len(v12);
            if (d === 0) {
                continue;
            }

            var factor = d * d / 1.5 / k;
            if (!n1.fixed) {
                vec2.scaleAndAdd(n1.force, n1.force, v12, factor);
            }
            if (!n2.fixed) {
                vec2.scaleAndAdd(n2.force, n2.force, v12, -factor);
            }
        }

        for (var i = 0; i < len; i++) {
            var node = this.nodes[i];
            if (node.fixed) {
                continue;
            }
            var velocity = node.velocity;
            vec2.scaleAndAdd(velocity, velocity, node.force, stepTime / 100000);

            velocity[0] = Math.max(Math.min(velocity[0], 1), -1);
            velocity[1] = Math.max(Math.min(velocity[1], 1), -1);

            vec2.scaleAndAdd(node.position, node.position, velocity, 0.2);
        }
    }

    return Force;
})