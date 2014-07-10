define(function(require) {

    var teamData = require('./team_data');

    var $chart1 = document.getElementById('chart1');
    var $chart2 = document.getElementById('chart2');

    // 实力对比
    return {
        show: function(chart1, chart2) {

            $chart1.style.left = '0px';
            $chart1.style.bottom = '0px';
            $chart1.style.width = '50%';
            $chart1.style.height = '100%';

            $chart2.style.bottom = '0px';
            $chart2.style.height = '100%';
            $chart2.style.left = '50%';
            $chart2.style.width = '50%';

            chart1.resize();
            chart2.resize();

            chart1.setOption({
                color:[teamData['德国'].color[0],teamData['法国'].color[0]],
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data: ['德国','法国'],
                    //x: '75%',
                    //y: '55%',
                    y:'25%',
                    itemGap:30,
                    norient: 'vertical'
                },
                polar : [{
                    radius: '50%',
                    indicator : [
                        {text : '进攻', max  : 100},
                        {text : '技术', max  : 100},
                        {text : '速度', max  : 100},
                        {text : '防守', max  : 100},
                        {text : '配合', max  : 100}
                    ],
                    name : {
                        textStyle: {
                            color:'aqua',
                            fontSize: 20
                        }
                    },
                    axisLine: {            // 坐标轴线
                        show: true,        // 默认显示，属性show控制显示与否
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'rgba(255,255,255,0.3)',
                            width: 1,
                            type: 'solid'
                        }
                    },
                    splitArea : {
                        show : true,
                        areaStyle : {
                            color: ['rgba(111,216,237,0.08)','rgba(111,216,237,0.05)']
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
                        data : [
                            {
                                symbolSize: 3,
                                name: '德国',
                                value :teamData['德国'].value,
                            },
                            {
                                symbolSize: 3,
                                name: '法国',
                                value :teamData['法国'].value,
                            }
                        ]
                    }
                ]
            }, true);


            var axisData = [];
            var data1 = [];
            var data2 = [];
            var performance = teamData['德国'].performance;
            var performance2 = teamData['法国'].performance;
            for (var key in performance) {
                if (key == '红牌') {
                    continue;
                }
                axisData.push(key);
                data1.push({
                    'name' : key,
                    'value' : performance[key]/(performance[key] + performance2[key])*100,
                    itemStyle: {
                        normal:{
                            label:{
                                show:true,
                                formatter:performance[key]+'',
                                position:'inside',
                                textStyle: {
                                    fontSize:20
                                }
                            }
                        }
                    }
                });
                data2.push({
                    'name' : key,
                    'value' : performance2[key]/(performance[key] + performance2[key])*100,
                    itemStyle: {
                        normal:{
                            label:{
                                show:true,
                                formatter:performance2[key]+'',
                                position:'inside',
                                textStyle: {
                                    fontSize:20
                                }
                            }
                        }
                    }
                });
            }
            chart2.setOption({
                color:[teamData['德国'].color[0],teamData['法国'].color[0]],
                ntooltip : {
                    trigger: 'axis',
                    axisPointer: {type:'shadow'}
                },
                grid:{y:'10%',x:'22%',y2:'10%',x2:'35%'},
                xAxis : [
                    {
                        type : 'value',
                        min:0,
                        max:100,
                        axisLabel:{
                            show:false
                        },
                        splitLine: {show:false}
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : axisData,
                        axisLabel: {
                            textStyle: {
                                fontSize: 20
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'德国',
                        type:'bar',
                        stack:'a',
                        data: data1
                    },
                    {
                        name:'法国',
                        type:'bar',
                        stack:'a',
                        data: data2
                    }
                ]
            }, true);
        }
    }
});