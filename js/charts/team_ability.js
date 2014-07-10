define(function(require) {

    var teamData = require('./team_data');

    var $chart1 = document.getElementById('chart1');
    var $chart2 = document.getElementById('chart2');

    return {
        show: function(chart1, chart2, curTeam) {
            
            $chart1.style.right = '0px';
            $chart1.style.bottom = '0px';
            $chart1.style.width = '100%';
            $chart1.style.height = '100%';

            $chart2.style.width = '0px';
            $chart2.style.height = '0px';

            chart1.resize();
            chart2.resize();

            var value = teamData[curTeam].value;
            
            chart1.setOption({
                ntooltip : {
                    trigger: 'axis'
                },
                title: {
                    x: "center",
                    y: 'center',
                    itemGap:20,
                    text: "综合评分",
                    subtext: teamData[curTeam].all,
                    textStyle: {
                        color: 'white',
                        fontSize: 40
                    },
                    subtextStyle: {
                        color: 'white',
                        fontSize: 38
                    }
                },
                polar : [{
                    indicator : [
                        {text : '进攻\n' + value[0] + '\n', max  : 100},
                        {text : '技术\n' + value[1], max  : 100},
                        {text : '速度\n' + value[2], max  : 100},
                        {text : '防守\n' + value[3], max  : 100},
                        {text : '配合\n' + value[4], max  : 100}
                    ],
                    name : {
                        textStyle: {
                            color:'aqua',
                            fontSize: 40
                        }
                    },
                    radius: "50%",
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
                        itemStyle: {normal: {
                            color:teamData[curTeam].color[0],
                            label: {
                                show:false,
                                textStyle: {
                                    color:teamData[curTeam].color[1],
                                    fontSize: 30
                                }
                            },
                            lineStyle: {
                                width : 3
                            }
                        }},
                        data : [
                            {
                                symbolSize: 3,
                                name: teamData[curTeam].name,
                                value : [
                                    {value :value[0], itemStyle: {normal: {label: {position:'bottom'}}}}, 
                                    {value :value[1], itemStyle: {normal: {label: {position:'top'}}}},
                                    {value :value[2], itemStyle: {normal: {label: {position:'left'}}}},
                                    {value :value[3], itemStyle: {normal: {label: {position:'right'}}}},
                                    {value :value[4], itemStyle: {normal: {label: {position:'top'}}}}
                                ],
                            }
                        ]
                    }
                ]
            }, true);
        }
    }
});