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

            var data = [];
            var performance = teamData[curTeam].performance;
            for (var key in performance) {
                data.push({
                    'name' : key,
                    'value' : performance[key] / (key == '传球' ? 8 : 1)
                });
                if (key == '传球') {
                    // 传球数据太畸形了
                    data[data.length - 1].itemStyle = {
                        normal: {
                            label: {
                                formatter: function(a,b,c) {
                                    return b + ' (' + (c * 8) +')';
                                }
                            }
                        }
                    }
                }
            }
            chart1.setOption({
                ntooltip : {
                    trigger: 'item',
                    formatter: function(a) {
                        return a[0] + '<br/>' + a[1] + ' : ' +  Math.round(a[2] * (a[1] == '传球'? 8 : 1));
                    }
                },
                series : [
                    {
                        name:'本届表现',
                        type:'pie',
                        radius : [50, '58%'],
                        roseType : 'area',
                        itemStyle: {
                            normal: {
                                borderColor: 'rgba(255,255,255,0.8)',
                                borderWidth: 1.5,
                                label: {
                                    formatter: '{b} ({c})',
                                    textStyle: {
                                        fontSize: 20
                                    }
                                },
                                labelLine: {
                                    length:10
                                }
                            }
                        },
                        data: data
                    },
                    {
                        name:'控球率',
                        type:'pie',
                        tooltip: {show:false},
                        radius : [35, 45],
                        data:[
                            {
                                name:'other', 
                                value : 100 - teamData[curTeam].control,
                                itemStyle : {
                                    normal : {
                                        color: 'rgba(230,230,230,0.2)',
                                        label : {
                                            show : true,
                                            position : 'center',
                                            formatter : function (a,b,c){return 100 - c + '%'},
                                            textStyle: {
                                                fontSize: 15,
                                                fontWeight: 'bolder',
                                                baseline : 'top'
                                            }
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    },
                                    emphasis: {
                                        color: 'rgba(0,0,0,0)'
                                    }
                                } 
                            },
                            {
                                name:'控球率', 
                                value : teamData[curTeam].control,
                                itemStyle : {
                                    normal : {
                                        color : 'aqua',
                                        label : {
                                            show : true,
                                            position : 'center',
                                            textStyle: {
                                                fontSize: 18,
                                                fontWeight: 'bolder',
                                                baseline : 'bottom'
                                            }
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    }
                                } 
                            }
                        ]
                    }
                ]
            }, true);
        }
    }

});