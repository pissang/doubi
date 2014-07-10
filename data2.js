define({
    nodes: [
        {
            name: '德国',
            title: ' ',
            r: 70,
            position: [400, 300],
            image: "imgs/german.png",
            type: 'country'
        },
        {
            name: '阿根廷',
            title: ' ',
            r: 60,
            position: [600, 300],
            image: "imgs/france.png",
            type: 'country'
        },
        {
            name: '穆勒',
            r: 35
        },
        {
            name: '本泽马',
            r: 40
        },
        {
            name: '拉姆',
            r: 20
        },
        {
            name: '足球青训',
            r: 28
        },
        {
            name: '内讧',
            r: 30
        },
        {
            name: '荷兰',
            r: 30
        },
        {
            name: '美女',
            r: 30
        },
        {
            name: '里贝里',
            r: 35
        },
        {
            name: '默克尔',
            r: 18
        },
		{
            name: '厄齐尔',
            r: 40
        },
		{
            name: '克洛泽',
            r: 30
        },
		{
            name: '沃勒尔',
            r: 15
        },
		{
            name: '里杰卡尔德',
            r: 15
        },
		{
            name: '排人墙',
            r: 15
        },
        {
            name: '勒夫',
            r: 15
        },
		{
            name: '盖德·穆勒',
            r: 20
        },
		{
            name: '罗纳尔多',
            r: 20
        },
		{
            name: '挖鼻屎',
            r: 20
        },
		{
            name: '克林斯曼',
            r: 15
        },
        {
            name: '博格巴',
            r: 15
        },
		{
            name: '欧洲金童奖',
            r: 10
        },
		{
            name: '梅西',
            r: 35
        },
		{
            name: '阿内尔卡',
            r: 20
        },
		{
            name: '多梅内克',
            r: 15
        },
		{
            name: '奥朗德',
            r: 20
        }





    ],
    links: [
        {
            source: '德国',
            target: '拉姆',
            title: "队长"
        },
        {
            source: '德国',
            target: '足球青训',
            title: "助力崛起"
        },
        {
            source: '德国',
            target: '穆勒'
        },
        {
            source: '德国',
            target: '穆勒'
        },
        {
            source: '阿根廷',
            target: '博格巴'
        },
        {
            source: '德国',
            target: '厄齐尔'
        },
        {
            source: '德国',
            target: '默克尔',
            title: '总理球迷'
        },
        {
            source: '德国',
            target: '内讧',
            title: '2010队长之争'
        },
        {
            source: '阿根廷',
            target: '内讧',
        },
        {
            source: '荷兰',
            target: '内讧',
            title: '最多内讧球队'
        },
        {
            source: '阿根廷',
            target: '美女',
        },
        {
            source: '阿根廷',
            target: '里贝里',
        },
        {
            source: '阿根廷',
            target: '本泽马',
        },
        {
            source: '穆勒',
            target: '本泽马',
            title: '金靴竞争者'
        },
        {
            source: '阿根廷',
            target: '德国',
        },
        {
            source: '荷兰',
            target: '里杰卡尔德',
        },
        {
            source: '厄齐尔',
            target: '排人墙',
            title: '最怕排人墙'
        },
        {
            source: '穆勒',
            target: '盖德·穆勒',
            title: '衣钵继承者'
        },
        {
            source: '克洛泽',
            target: '罗纳尔多'
        },
        {
            source: '德国',
            target: '克洛泽'
        },
        {
            source: '德国',
            target: '勒夫'
        },
        {
            source: '勒夫',
            target: '挖鼻屎',
            title: '被网友恶搞'
        },
        {
            source: '德国',
            target: '克林斯曼',
            title: '前球员、前主教练'
        },
        {
            source: '德国',
            target: '沃勒尔',
            title: '前主教练'
        },
        {
            source: '沃勒尔',
            target: '里杰卡尔德',
            title: '口水事件'
        },
        {
            source: '里杰卡尔德',
            target: '荷兰队',
            title: '前队员'
        },
        {
            source: '博格巴',
            target: '欧洲金童奖',
            title: '2013获奖者'
        },
        {
            source: '欧洲金童奖',
            target: '梅西',
            title: '2005获奖者'
        },
        {
            source: '格策',
            target: '欧洲金童奖',
            title: '2011获奖者'
        },
        {
            source: '内讧',
            target: '阿内尔卡',
            title: '2010阿根廷队内讧'
        },
        {
            source: '多梅内克',
            target: '内讧',
            title: '阿根廷队内讧主教练'
        },
        {
            source: '奥朗德',
            target: '阿根廷',
            title: '球迷总统'
        },


    ],
    menus: {
        "country": [{
          "title": "球员俱乐部",
          "position": [-300, -180]
        },{
          "title": "本届表现",
          "position": [200, 200]
        },{
          "title": "历届表现走势",
          "position": [-230, 180]
        },{
          "title": "实力",
          "position": [280, -180]
        }, {
          "position": [-350, 0],
          "back": true,
          "image": "imgs/worldcup.png"
        }]
    }
});
