define({
    wColor : '#c12e34',
    tColor:'#e6b600',
    lColor:'#0098d9',
    "德国" : {
        color:['#ffcc00', '#e20047'],
        name : '德国',
        value : [94, 91, 94, 97, 95],
        all: 95,
        win : 80,
        performance : {
            '进球数' : 17,
            '失球' : 4,
            '助攻' : 11,
            '射正' : 43,
            '射门' : 89,
            '扑救' : 23,
            '越位' : 14,
            '黄牌' : 4,
            '红牌' : 0,
            '传球' : 3608,
            '抢断' : 113,
            '犯规' : 71,
            '拦截' : 42,
            '角球' : 32,
            //'控球率' : 59.43,
            '解围' : 159
        },
        control: 59.43,   // 控球率
        
        // 历史战绩
        history : [
            {name : '1982', value : 6},
            {name : '1986', value : 6},
            {name : '1990', value : 7},
            {name : '1994', value : 4},
            {name : '1998', value : 4},
            {name : '2002', value : 6},
            {name : '2006', value : 5},
            {name : '2010', value : 5},
        ],
        historyWin : [3,3,5,3,3,5,5,5],
        historyTie : [2,2,2,1,1,1,1,0],
        historyLose: [2,2,0,1,1,1,1,2],
        
        // 效力球队
        chordData : [
            {name:'默特萨克'},
            {name:'厄齐尔'},
            {name:'波多尔斯基'},
            {name:'诺伊尔'},
            {name:'博阿滕'},
            {name:'施魏因施泰格'},
            {name:'拉姆'},
            {name:'克罗斯'},
            {name:'穆勒'},
            {name:'格策'},
            {name:'胡梅尔斯'},
            {name:'魏登费勒'},
            {name:'杜尔姆'},
            {name:'格罗斯克罗伊茨'},
            {name:'【 阿森纳 】'},
            {name:'【 拜仁慕尼黑 】'},
            {name:'【 多特蒙德 】'}
        ],
        chordMatrix : [
            //阿森纳
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
            //拜仁
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            //多特蒙德
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            //球队
            [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0]
        ],
        
        team : {
            '穆勒': [88,83,83,85,86,87,85],
            '克罗斯': [69,74,78,75,83,80,77],
            '拉姆': [73,86,91,86,88,71,83]
        },
        
        teamP : ['进球','助攻','传球','抢断','射门','射正','射正率','准确传球','过人','拦截','解围','头球解围','后场解围'],
        teamP2 : {
            '穆勒' : [5,3,201,6,16,8,0.5,150,12,6,0,0,0],
            '克罗斯' : [2,3,498,12,13,4,0.4,454,9,12,2,0,3],
            '拉姆' : [0,2,480,14,3,1,0.4,438,3,14,6,12,21]
        },
        
        "total": [465700000, 75.04, 23],
        "前锋": [1200000, 74, 1],
        "后卫": [115700000, 75.38, 8],
        "中场": [308900000, 75.27, 11],
        "守门员": [39900000, "73.67", 3],
        "players": [
            ["560", "胡梅尔斯", "德国", "后卫", "25", 26000000, 83],
            ["558", "默特萨克", "德国", "后卫", "29", 15000000, 79],
            ["561", "赫韦德斯", "德国", "后卫", "26", 18600000, 78],
            ["557", "拉姆", "德国", "后卫", "30", 20100000, 77],
            ["572", "穆斯塔菲", "德国", "后卫", "22", 4000000, 74],
            ["562", "格罗斯克罗伊茨", "德国", "后卫", "25", 11100000, 71],
            ["574", "金特尔", "德国", "后卫", "20", 2400000, 71],
            ["559", "博阿滕", "德国", "后卫", "25", 18500000, 70],
            ["576", "克洛泽", "德国", "前锋", "36", 1200000, 74],
            ["564", "波多尔斯基", "德国", "中场", "29", 18500000, 72],
            ["554", "诺伊尔", "德国", "守门员", "28", 24900000, 78],
            ["556", "齐勒", "德国", "守门员", "25", 10000000, 75],
            ["555", "魏登费勒", "德国", "守门员", "33", 5000000, 68],
            ["566", "厄齐尔", "德国", "中场", "25", 45000000, 83],
            ["571", "格策", "德国", "中场", "22", 55000000, 80],
            ["568", "赫迪拉", "德国", "中场", "27", 20000000, 80],
            ["567", "穆勒", "德国", "中场", "24", 45000000, 79],
            ["569", "克罗斯", "德国", "中场", "24", 40000000, 78],
            ["565", "施魏因施泰格", "德国", "中场", "29", 38500000, 77],
            ["570", "许尔勒", "德国", "中场", "23", 21500000, 72],
            ["573", "德拉克斯勒", "德国", "中场", "20", 20000000, 72],
            ["575", "克拉默", "德国", "中场", "23", 2400000, 71],
            ["563", "杜尔姆", "德国", "中场", "22", 3000000, 64]
        ]
    },
    "阿根廷" : {
        color:['#87cefa', '#fff'],
        name : '阿根廷',
        value : [98, 94, 95, 93, 85],
        all: 96,
        win : 70,
        performance : {
            '进球数' : 7,
            '失球' : 3,
            '助攻' : 3,
            '射正' : 33,
            '射门' : 98,
            '扑救' : 16,
            '越位' : 8,
            '黄牌' : 6,
            '红牌' : 0,
            '传球' : 3069,
            '抢断' : 130,
            '犯规' : 61,
            '拦截' : 85,
            '角球' : 44,
            //'控球率' : 58.55,
            '解围' : 179
        },
        control: 58.55,   // 控球率
        
        // 历史战绩
        history : [
            {name : '1982', value : 3},
            {name : '1986', value : 7},
            {name : '1990', value : 6},
            {name : '1994', value : 3},
            {name : '1998', value : 4},
            {name : '2002', value : 2},
            {name : '2006', value : 4},
            {name : '2010', value : 4},
        ],
        historyWin : [2,6,4,2,4,1,3,4],
        historyTie : [0,1,1,0,0,1,1,0],
        historyLose: [3,0,2,2,1,1,1,1],
        
        // 效力球队
        chordData : [
            {name:'梅西'},
            {name:'马斯切拉诺'},
            {name:'罗梅罗'},
            {name:'伊瓜因'},
            {name:'F-费尔南德斯'},
            {name:'坎帕尼亚罗'},
            {name:'帕拉西奥'},
            {name:'阿尔瓦雷斯'},
            {name:'萨巴莱塔'},
            {name:'德米凯利斯'},
            {name:'阿圭罗'},
            {name:'比格利亚'},
            {name:'加雷'},
            {name:'佩雷斯'},
            {name:'安杜哈尔'},
            {name:'加戈'},
            {name:'奥里昂'},
            {name:'迪玛利亚'},
            {name:'罗德里格斯'},
            {name:'A-费尔南德斯'},
            {name:'罗霍'},
            {name:'拉维奇'},
            {name:'巴桑塔'},
            {name:'【 巴塞罗那 】'},
            {name:'【 摩纳哥 】'},
            {name:'【 那不勒斯 】'},
            {name:'【 国际米兰 】'},
            {name:'【 曼联 】'},
            {name:'【 拉齐奥 】'},
            {name:'【 本菲卡 】'},
            {name:'【 卡塔尼亚 】'},
            {name:'【 博卡青年 】'},
            {name:'【 皇家马德里 】'},
            {name:'【 纽维尔斯 】'},
            {name:'【 维戈塞尔塔 】'},
            {name:'【 里斯本竞技 】'},
            {name:'【 圣日耳曼 】'},
            {name:'【 蒙特雷 】'}
        ],
        chordMatrix : [
            //巴塞罗那
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            //摩纳哥
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
            //那不勒斯
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
            //国际米兰
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            //曼联
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
            //拉齐奥
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
            //本菲卡
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
            //安塔尼亚
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
            //博卡青年
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
            //皇家马德里
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
            //纽维尔斯
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
            //维戈塞尔塔
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
            //里斯本竞技
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
            //圣日耳曼
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
            //蒙特雷
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            //球队
            [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ],
        
        team : {
            '梅西': [86,76,84,93,97,68,84],
            '马斯切拉诺': [78,82,86,84,85,72,81],
            '罗霍': [74,70,72,78,77,83,76],
            "迪玛利亚": [87,80,83,88,89,73]
        },
        
        teamP : ['进球','助攻','传球','抢断','射门','射正','射正率','准确传球','过人','拦截','解围','头球解围','后场解围'],
        teamP2 : {
            '梅西' : [4,1,252,10,19,8,0.5,206,62,10,2,0,0],
            '马斯切拉诺' : [0,0,509,28,4,2,0.5,460,2,28,13,3,9],
            '罗霍' : [1,0,212,17,8,2,0.3,178,3,17,11,10,17],
            "迪玛利亚": [1,0,242,7,24,9,0.4,1,186,47,35,9]
        },
        
        "total": [354120000, 74.65, 23],
        "前锋": [217400000, 81.6, 5],
        "后卫": [44400000, 73.71, 7],
        "中场": [79170000, 73.63, 8],
        "守门员": [13150000, "68.00", 3],
        "players": [
            ["465", "萨巴莱塔", "阿根廷", "后卫", "29", 19100000, 79],
            ["470", "德米凯利斯", "阿根廷", "后卫", "33", 1000000, 78],
            ["466", "加雷", "阿根廷", "后卫", "27", 13500000, 74],
            ["468", "坎帕尼亚罗", "阿根廷", "后卫", "33", 3000000, 72],
            ["471", "罗霍", "阿根廷", "后卫", "24", 2600000, 72],
            ["469", "巴桑塔", "阿根廷", "后卫", "30", 2300000, 71],
            ["467", "F-费尔南德斯", "阿根廷", "后卫", "25", 2900000, 70],
            ["480", "梅西", "阿根廷", "前锋", "26", 120000000, 91],
            ["481", "阿奎罗", "阿根廷", "前锋", "26", 48500000, 84],
            ["483", "拉维奇", "阿根廷", "前锋", "26", 21000000, 78],
            ["483", "伊瓜因", "阿根廷", "前锋", "29", 15900000, 78],
            ["484", "帕拉西奥", "阿根廷", "前锋", "32", 12000000, 77],
            ["463", "安杜哈尔", "阿根廷", "守门员", "30", 2800000, 70],
            ["464", "奥里昂", "阿根廷", "守门员", "32", 850000, 68],
            ["462", "罗梅罗", "阿根廷", "守门员", "27", 9500000, 66],
            ["472", "马斯切拉诺", "阿根廷", "中场", "30", 13500000, 79],
            ["475", "迪玛利亚", "阿根廷", "中场", "26", 30000000, 76],
            ["478", "A-费尔南德斯", "阿根廷", "中场", "28", 8000000, 76],
            ["477", "阿尔瓦雷斯", "阿根廷", "中场", "26", 13500000, 74],
            ["479", "佩雷斯", "阿根廷", "中场", "28", 3500000, 72],
            ["474", "比格利亚", "阿根廷", "中场", "28", 7500000, 71],
            ["476", "马克西-罗德里格斯", "阿根廷", "中场", "33", 570000, 71],
            ["473", "加戈", "阿根廷", "中场", "28", 2600000, 70]
        ]
    }
})