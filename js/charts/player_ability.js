define(function(require) {

    var teamData = require('./team_data');

    var $chart1 = document.getElementById('chart1');
    var $chart2 = document.getElementById('chart2');

    return {
        show: function(chart1, chart2, curTeam, playerName) {
            
            $chart1.style.right = '0px';
            $chart1.style.bottom = '0px';
            $chart1.style.width = '100%';
            $chart1.style.height = '100%';

            $chart2.style.width = '0px';
            $chart2.style.height = '0px';

            chart1.resize();
            chart2.resize();

            var team = teamData[curTeam].team;
            var radarData = [];
            var legendData = [];
            for (var key in team) {
                if (key == playerName) {
                    legendData.push(key);
                    radarData.push({
                        name: key,
                        value : team[key],
                    })
                }
            }
            var newV = [];
            for (var i = 0, l = radarData[0].value.length; i < l; i++) {
                newV.push(radarData[0].value[i]);
            }
            radarData[0].value = newV;
            radarData[0].value[0] = {value:radarData[0].value[0], itemStyle : {normal: {label: {position:'bottom'}}}};
            radarData[0].value[1] = {value:radarData[0].value[1], itemStyle : {normal: {label: {position:'right'}}}};
            radarData[0].value[2] = {value:radarData[0].value[2], itemStyle : {normal: {label: {position:'right'}}}};
            radarData[0].value[3] = {value:radarData[0].value[3], itemStyle : {normal: {label: {position:'top'}}}};
            radarData[0].value[4] = {value:radarData[0].value[4], itemStyle : {normal: {label: {position:'left'}}}};
            radarData[0].value[5] = {value:radarData[0].value[5], itemStyle : {normal: {label: {position:'left'}}}};

            chart1.setOption({
                toolttip : {
                    trigger: 'axis'
                },
                title: {
                    x: "center",
                    y: 'center',
                    itemGap:20,
                    text: "综合评分",
                    subtext: teamData[curTeam].team[playerName][6],
                    textStyle: {
                        color: 'white',
                        fontSize: 40
                    },
                    subtextStyle: {
                        color: 'white',
                        fontSize: 30
                    }
                },
                polar : [{
                    indicator : [
                        {text : '状态\n' + radarData[0].value[0].value, max  : 100},
                        {text : '心理\n' + radarData[0].value[1].value, max  : 100},
                        {text : '经验\n' + radarData[0].value[2].value, max  : 100},
                        {text : '意识\n' + radarData[0].value[3].value, max  : 100},
                        {text : '技术\n' + radarData[0].value[4].value, max  : 100},
                        {text : '身体\n' + radarData[0].value[5].value, max  : 100}
                    ],
                    name : {
                        textStyle: {
                            color:'aqua',
                            fontSize: 30
                        }
                    },
                    radius: "65%",
                    axisLine: {            // 坐标轴线
                        show: true,        // 默认显示，属性show控制显示与否
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'rgba(255,255,255,0.5)',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    splitArea : {
                        show : true,
                        areaStyle : {
                            color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
                        }
                    },
                    splitLine : {
                        show : true,
                        lineStyle : {
                            width : 1,
                            color : 'rgba(250,250,250,0.3)'
                        }
                    }
                }],
                series : [
                    {
                        type: 'radar',
                        itemStyle: {
                            normal: {
                                label: {
                                    show:false,
                                    textStyle: {
                                        fontSize: 20
                                    }
                                },
                                lineStyle: {
                                    width:3
                                }
                            }
                        },
                        data : radarData
                    }
                ]
            }, true);
        }
    }
});