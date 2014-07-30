define(function(require) {

    var data = JSON.parse(require('text!./relation3.json'));
    var zrUtil = require('zrender/tool/util');

    return {

        actorRoleMap: {
            "杨幂": "林萧",
            "锦荣": "宫洺",
            "柯震东": "顾源",
            "郭碧婷": "南湘",
            "谢依霖": "唐宛如",
            "姜潮": "席城",
            "王琳": "叶传萍",
            "陈学冬": "周崇光",
            "商侃": "Kitty",
            "李贤宰": "Neil",
            "任佑明": "顾准",
            "郭采洁": "顾里",
            "杜天皓": "卫海"
        },

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
                    radius: 45,
                    image: backNode.image,
                    position: [300, 300],
                    action: 'back'
                })

                graph.edges.push({
                    source: name,
                    target: backNode.name,
                    label: name == '郭敬明' ? '小说作者' : '扮演者',
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