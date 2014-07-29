define(function(require) {

    var data = JSON.parse(require('text!./relation3.json'));
    var zrUtil = require('zrender/tool/util');

    return {
        get: function(name, node, backNode) {
            var graph = data[name];
            if (graph) {
                
                graph = zrUtil.clone(graph);

                graph.nodes.push({
                    name: '小时代-返回',
                    title: '返回',
                    radius: 45,
                    position: [200, 150],
                    fixed: true,
                    image: 'imgs/logo-back.png',
                    action: 'back/back'
                });

                graph.nodes.push({
                    name: backNode.name,
                    radius: 40,
                    image: backNode.image,
                    position: [300, 300],
                    action: 'back'
                })

                graph.edges.push({
                    source: name,
                    target: backNode.name,
                    label: '扮演者',
                    weight: 10
                });
                graph.edges.push({
                    source: backNode.name,
                    target: '小时代-返回',
                    label: '小说角色',
                    weight: 10
                });

                for (var i = 0 ; i < graph.nodes.length; i++) {
                    if (graph.nodes[i].name === name) {
                        graph.nodes[i].image = node.image;
                    }
                }
            }
            return graph;
        }
    }
});