define(function(require) {

    var data = JSON.parse(require('text!./relation3.json'));

    return {
        get: function(name, backNode) {
            var graph = data[name];
            if (graph) {
                graph.nodes.push({
                    name: backNode.name,
                    radius: 40,
                    position: [300, 300],
                    image: backNode.image,
                    action: 'back'
                });
                graph.edges.push({
                    source: name,
                    target: backNode.name,
                    label: '扮演者'
                })
            }
            return graph;
        }
    }
});