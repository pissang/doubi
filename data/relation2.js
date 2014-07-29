define(function(require) {
    // TODO 宫洛
    // TODO 周崇光 剧照
    var actors = {
        '林萧': {
            actor: '杨幂',
            life: 'imgs/actors/林萧-杨幂-生活照.jpg',
            still: 'imgs/actors/林萧-剧照.jpg'
        },
        '宫洺': {
            actor: '锦荣',
            life: 'imgs/actors/宫洺-锦荣-生活照.jpg',
            still: 'imgs/actors/宫洺-剧照.jpg'
        },
        '顾源': {
            actor: '柯震东',
            life: 'imgs/actors/顾源-柯震东-生活照.jpg',
            still: 'imgs/actors/顾源-剧照.jpg'
        },
        '南湘': {
            actor: '郭碧婷',
            life: 'imgs/actors/南湘-郭碧婷-生活照.jpg',
            still: 'imgs/actors/南湘-剧照.jpg'
        },
        '唐宛如': {
            actor: '谢依霖',
            life: 'imgs/actors/唐宛如-谢依霖-生活照.jpg',
            still: 'imgs/actors/唐宛如-剧照.jpg'
        },
        '席城': {
            actor: '姜潮',
            life: 'imgs/actors/席城-姜潮-生活照.jpg',
            still: 'imgs/actors/席城-剧照.jpg'
        },
        '叶传萍': {
            actor: '王琳',
            life: 'imgs/actors/叶传萍-王琳-生活照.jpg',
            still: 'imgs/actors/叶传萍-剧照.jpg'
        },
        '周崇光': {
            actor: '陈学冬',
            life: 'imgs/actors/周崇光-陈学冬-生活照.jpg',
            still: 'imgs/actors/周崇光-剧照.jpg'
        },
        'Kitty': {
            actor: '商侃',
            life: 'imgs/actors/Kitty-商侃-生活照.jpg',
            still: 'imgs/actors/Kitty-剧照.jpg'
        },
        'Neil': {
            actor: '李贤宰',
            life: 'imgs/actors/Neil-李贤宰-生活照.jpg',
            still: 'imgs/actors/Neil-剧照.jpg'
        },
        '顾准': {
            actor: '任佑明',
            life: 'imgs/actors/顾准-任佑明-生活照.jpg',
            still: 'imgs/actors/顾准-剧照.jpg'
        },
        '顾里': {
            actor: '郭采洁',
            life: 'imgs/actors/顾里-郭采洁-生活照.jpg',
            still: 'imgs/actors/顾里-剧照.jpg'
        },
        '卫海': {
            actor: '杜天皓',
            life: 'imgs/actors/卫海-杜天皓-生活照.jpg',
            still: 'imgs/actors/卫海-剧照.jpg'
        }
    }

    var getTpl = function (opt) {
        return {
            nodes: [
                {
                    name: opt.roleName,
                    image: opt.roleImage,
                    radius: 100
                },
                {
                    name: '剧照',
                    title: '',
                    image: opt.still,
                    radius: 55,
                    action: 'detail/剧照/' + opt.roleName
                },
                {
                    name: opt.actor,
                    image: opt.life,
                    radius: 60,
                    action: 'actor/' + opt.actor
                },
                {
                    name: '郭敬明',
                    image: 'imgs/郭敬明.jpg',
                    radius: 55,
                    action: 'actor/郭敬明'
                },
                {
                    name: '角色概况',
                    title: '角色\n概况',
                    radius: 40,
                    action: 'detail/角色/' + opt.roleName
                },
                {
                    name: '微博',
                    title: '',
                    image: 'imgs/weibo.jpg',
                    radius: 40,
                    action: 'detail/微博热议/' + opt.actor
                },
                {
                    name: '小时代',
                    title: '返回',
                    image: 'imgs/logo-back.png',
                    action: 'back',
                    radius: 40,
                    position: [300, 150],
                    fixed: true
                }
            ],
            edges: [
                {
                    source: opt.roleName,
                    target: '剧照',
                    label: '剧照'
                },
                {
                    source: opt.roleName,
                    target: '角色概况',
                    label: '角色简介'
                },
                {
                    source: opt.roleName,
                    target: opt.actor,
                    label: '扮演者'
                },
                {
                    source: opt.roleName,
                    target: '郭敬明',
                    label: '小说作者'
                },
                {
                    source: opt.roleName,
                    target: '微博',
                    label: '微博热议'
                },
                {
                    source: opt.roleName,
                    target: '小时代',
                    label: '小说角色'
                }
            ]
        }
    }

    return {
        get: function(name, fromNode) {
            var info = actors[name];
            if (info) {
                return getTpl({
                    actor: info.actor,
                    still: info.still,
                    life: info.life,
                    roleName: fromNode.name,
                    roleImage: fromNode.image
                });
            }
        }
    }
});