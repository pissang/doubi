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

            var teamP = teamData[curTeam].teamP;
            var teamP2 = teamData[curTeam].teamP2;
            var pieData = [];
            for (var key in teamP2) {
                if (key == playerName) {
                    for (var i = 0, l = teamP.length; i < l; i++) {
                        pieData.push({
                            name: teamP[i],
                            value : teamP2[key][i] / (teamP[i] == '传球' || teamP[i] == '触球' ? 6 : 1)
                        });
                        if (teamP[i] == '传球'|| teamP[i] == '触球') {
                            // 传球数据太畸形了
                            pieData[pieData.length - 1].itemStyle = {
                                normal: {
                                    label: {
                                        formatter: function(a,b,c) {
                                            return b + ' (' + (c * 6) +')';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            chart1.setOption({
                series: [
                    {
                        name:'本届表现',
                        type:'pie',
                        radius : [20, '60%'],
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
                        data: pieData
                    }
                ]
            }, true);
        }
    }
});