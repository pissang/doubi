define({
    nodes: [
        {
            name: '德国',
            r: 60,
            position: [400, 300],
            image: "german.jpg",
            type: 'country'
        },
        {
            name: '阿根廷',
            r: 60,
            position: [600, 300],
            image: "france.jpg",
            type: 'country'
        },
        {
            name: '穆勒',
            r: 30
        },
        {
            name: '本泽马',
            r: 35
        },
        {
            name: '球员信息 - 德国',
            title: '球员信息',
            r: 40
        },
        {
            name: '球员信息 - 阿根廷',
            title: '球员信息',
            r: 40
        },
        {
            name: '拉姆',
            r: 30
        },
        {
            name: '足球青训',
            r: 30
        },
        {
            name: '内讧',
            r: 30
        },
        {
            name: '荷兰',
            r: 20
        },
        {
            name: '美女',
            r: 30
        },
        {
            name: '里贝里',
            r: 25
        },
        {
            name: '默克尔',
            r: 30
        }
    ],
    links: [
        {
            source: '德国',
            target: '球员信息 - 德国'
        },
        {
            source: '阿根廷',
            target: '球员信息 - 阿根廷'
        },
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
            source: '德国',
            target: '默克尔',
            title: '总理球迷'
        },
        {
            source: '德国',
            target: '内讧',
            title: '200w队长之争'
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
    ],
    "menus": {
      "country": [{
          "title": "球员俱乐部",
          "position": [-250, -180]
      },{
          "title": "本届表现",
          "position": [180, 200]
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
      }],
      "player": [{
          "position": [-350, 0],
          "back": true,
          "image": "imgs/worldcup.png"
      }]
    }
});