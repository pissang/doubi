define(function(require) {

    var Graph = require('./Graph');

    var ForceLayout = require('echarts/chart/ForceLayoutWorker');
    var glMatrix = require('glmatrix');
    var vec2 = glMatrix.vec2;

    var Force = function(graph) {
        
        this.graph = graph || new Graph();

        this._layout = new ForceLayout();

        this.width = 0;
        this.height = 0;
    }

    Force.prototype.run = function() {

        var width = this.width;
        var height = this.height;

        var graph = this.graph;

        var positionArr = new Float32Array(graph.nodes.length * 2);
        var radiusArr = new Float32Array(graph.nodes.length);
        var weightArr = new Float32Array(graph.nodes.length);

        var minR = Infinity;
        var maxR = -Infinity;
        var nodesIdxMap = {};

        for (var i = 0; i < graph.nodes.length; i++) {
            var node = graph.nodes[i];

            nodesIdxMap[node.name] = i;

            var x = width / 2 * (1.5 - Math.random());
            var y = height / 2 * (1.5 - Math.random());

            if (!graph.nodes[i].position) {
                graph.nodes[i].position = [x, y];
            }

            positionArr[i * 2] = x;
            positionArr[i * 2 + 1] = y;

            radiusArr[i] = node.radius;

            if (node.radius > maxR) {
                maxR = node.radius;
            }
            if (node.radius < minR) {
                minR = node.radius;
            }
        }

        for (var i = 0; i < radiusArr.length; i++) {
            weightArr[i] = radiusArr[i] / maxR;
        }
        
        var edgeArr = new Float32Array(graph.edges.length * 2);
        var edgeWeightArr = new Float32Array(graph.edges.length)
        for (var i = 0; i < graph.edges.length; i++) {
            var edge = graph.edges[i];
            edgeArr[i * 2] = nodesIdxMap[edge.source.name];
            edgeArr[i * 2 + 1] = nodesIdxMap[edge.target.name];

            edgeWeightArr[i] = edge.weight || 1;
        }

        this._layout.initNodes(positionArr, weightArr, radiusArr);
        this._layout.initEdges(edgeArr, edgeWeightArr);
        this._layout.center = [width / 2, height / 2];
        this._layout.width = width;
        this._layout.height = height;
        this._layout.scaling = 2;
        this._layout.gravity = 1.5;
        this._layout.preventOverlap = true;

        for (var i = 0; i < 100; i++) {
            this._layout.update();
        }

        for (var i = 0; i < this._layout.nodes.length; i++) {
            vec2.copy(graph.nodes[i].position, this._layout.nodes[i].position);
        }
    }

    return Force;
});