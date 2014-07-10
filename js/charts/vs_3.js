define(function(require) {

    var teamData = require('./team_data');

    var $chart1 = document.getElementById('chart1');
    var $chart2 = document.getElementById('chart2');

    // 身价对比
    return {
        show: function(chart1, chart2) {

            $chart1.style.right = '0px';
            $chart1.style.width = '100%';
            $chart1.style.height = '30%';

            $chart2.style.bottom = '0px';
            $chart2.style.height = '70%';
            $chart2.style.left = '0px';
            $chart2.style.right = '0px';
            $chart2.style.width = '100%';

            chart1.resize();
            chart2.resize();

            var placeHoledStyle = {
                normal:{
                    label : {
                        show: false
                    }
                },
                emphasis:{
                    borderColor:'rgba(0,0,0,0)',
                    color:'rgba(0,0,0,0)'
                }
            };
            var dataStyle = { 
                normal: {
                    label : {
                        show: true,
                        position: 'inside',
                        formatter: function(a,b,c) {
                            return Math.round(c/10000) + '万'
                        }
                    }
                }
            };
            chart1.setOption({
                legend: {
                    y:'25%',
                    data:['前锋', '中场', '后卫', '守门员']
                },
                grid:{y:'40%',x:'25%',y2:20,x2:'10%'},
                xAxis : [
                    {
                        type : 'value',
                        position: 'top',
                        splitLine: {show: false},
                        axisLabel: {show: false}
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        splitLine: {show: false},
                        axisLabel : {
                            textStyle: {
                                fontSize:20
                            }
                        },
                        data : ['德国', '法国']
                    }
                ],
                series : [
                    {
                        name:'前锋',
                        type:'bar',
                        stack: '总量',
                        itemStyle : dataStyle,
                        data:[
                            {value : teamData['德国']['前锋'][0], itemStyle:placeHoledStyle},
                            teamData['法国']['前锋'][0]
                        ]
                    },
                    {
                        name:'中场',
                        type:'bar',
                        stack: '总量',
                        itemStyle : dataStyle,
                        data:[
                            teamData['德国']['中场'][0],
                            teamData['法国']['中场'][0]
                        ]
                    },
                    {
                        name:'后卫',
                        type:'bar',
                        stack: '总量',
                        itemStyle : dataStyle,
                        data:[
                            teamData['德国']['后卫'][0],
                            teamData['法国']['后卫'][0]
                        ]
                    },
                    {
                        name:'守门员',
                        type:'bar',
                        stack: '总量',
                        itemStyle : dataStyle,
                        data:[
                            teamData['德国']['守门员'][0],
                            {value : teamData['法国']['守门员'][0], itemStyle:placeHoledStyle}
                        ]
                    }
                ]
            }, true);
            
            
            //------------
            var data = {
                'germany' : {},
                'france' : {}
            };
            var players = teamData['德国'].players;
            for (var i = 0, l = players.length; i < l; i++) {
                data['germany'][players[i][3]] = data['germany'][players[i][3]] || [];
                data['germany'][players[i][3]].push({
                    name : players[i][1],
                    value : [players[i][6], players[i][5]]
                })
            }
            players = teamData['法国'].players;
            for (var i = 0, l = players.length; i < l; i++) {
                data['france'][players[i][3]] = data['france'][players[i][3]] || [];
                data['france'][players[i][3]].push({
                    name : players[i][1],
                    value : [players[i][6], players[i][5]]
                })
            }
            var symbolSize = 8;
            var tooltip = {
                            trigger:'item',
                            position:[150, 100],
                            formatter:function(a) {
                                return a[0] + '<br/>' + a[1] + '<br/>' +
                                       '身价 : ' + a[2][1] / 10000 + '万<br/>' +
                                       '能力 : ' + a[2][0];
                            }
                        };
            chart2.setOption({
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {type:'cross'}
                },
                legend: {
                    itemGap:20,
                    y:30,
                    data:[
                        '德国前锋', '德国中场', '德国后卫', '德国守门员', '',
                        '法国前锋', '法国中场', '法国后卫', '法国守门员'
                    ]
                },
                grid:{y:100,x:'20%',y2:'20%',x2:'20%'},
                xAxis : [
                    {
                        type : 'value',
                        scale: true
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel: {
                            formatter: function(v) {
                                return v != 0 ? (v/10000 + '万') : '';
                            }
                        }
                        
                    }
                ],
                series : [
                    {
                        name:'德国前锋',
                        type:'scatter',
                        symbol:'triangle',
                        symbolSize:symbolSize,
                        tooltip: tooltip,
                        itemStyle:{
                            normal:{color:'rgba(255,219,76,0.8)'}
                        },
                        data: data['germany']['前锋']
                    },
                    {
                        name:'德国中场',
                        type:'scatter',
                        symbol:'circle',
                        symbolSize:symbolSize,
                        tooltip: tooltip,
                        itemStyle:{
                            normal:{color:'rgba(255,219,76,0.8)'}
                        },
                        data: data['germany']['中场']
                    },
                    {
                        name:'德国后卫',
                        type:'scatter',
                        symbol:'diamond',
                        symbolSize:symbolSize,
                        tooltip: tooltip,
                        itemStyle:{
                            normal:{color:'rgba(255,219,76,0.8)'}
                        },
                        data: data['germany']['后卫']
                    },
                    {
                        name:'德国守门员',
                        type:'scatter',
                        symbol:'star6',
                        symbolSize:symbolSize,
                        tooltip: tooltip,
                        itemStyle:{
                            normal:{color:'rgba(255,219,76,0.8)'}
                        },
                        data: data['germany']['守门员']
                    },
                    {
                        name:'法国前锋',
                        type:'scatter',
                        symbol:'triangle',
                        symbolSize:symbolSize,
                        tooltip: tooltip,
                        itemStyle:{
                            normal:{color:'rgba(76,210,227,0.8)'}
                        },
                        data: data['france']['前锋']
                    },
                    {
                        name:'法国中场',
                        type:'scatter',
                        symbol:'circle',
                        symbolSize:symbolSize,
                        tooltip: tooltip,
                        itemStyle:{
                            normal:{color:'rgba(76,210,227,0.8)'}
                        },
                        data: data['france']['中场']
                    },
                    {
                        name:'法国后卫',
                        type:'scatter',
                        symbol:'diamond',
                        symbolSize:symbolSize,
                        tooltip: tooltip,
                        itemStyle:{
                            normal:{color:'rgba(76,210,227,0.8)'}
                        },
                        data: data['france']['后卫']
                    },
                    {
                        name:'法国守门员',
                        type:'scatter',
                        symbol:'star6',
                        symbolSize:symbolSize,
                        tooltip: tooltip,
                        itemStyle:{
                            normal:{color:'rgba(76,210,227,0.8)'}
                        },
                        data: data['france']['守门员']
                    }
                ]
            }, true);
        }
    }
});