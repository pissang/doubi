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

            var axisData = [];
            var history = teamData[curTeam].history;
            var data = [];
            var dataWin = teamData[curTeam].historyWin;
            var dataTie = teamData[curTeam].historyTie;
            var dataLose = teamData[curTeam].historyLose;
            
            for (var i = 0, l = history.length; i < l; i++) {
                var key = history[i].name;
                axisData.push(key);
                data.push({
                    name : 'key',
                    value : history[i].value != '-' ? (history[i].value + 5) : '-'
                });
            }

            chart1.setOption({
                color : [teamData.wColor, teamData.tColor, teamData.lColor,teamData[curTeam].color[0]],
                legend: {
                    y:'bottom',
                    padding:[0,0,50,0],
                    data:['胜','平','负']
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer:{type:'shadow'},
                    formatter: function(a) {
                        var res = a[0][0] + '<br/>' + a[0][1] + ' : ';
                        switch (a[0][2] - 5) {
                            case 7 : res += '冠军'; break;
                            case 6 : res += '亚军'; break;
                            case 5 : res += '第三名'; break;
                            case 4 : res += '1/4'; break;
                            case 3 : res += '1/8'; break;
                            case 2 : res += '1/16'; break;
                            case 1 : res += '1/32'; break;
                            default : res += '没能进入32强'; break;
                        }
                        res += '<br/>';
                        res += a[1][0] + ' : ' + a[1][2] + '<br/>';
                        res += a[2][0] + ' : ' + a[2][2] + '<br/>';
                        res += a[3][0] + ' : ' + a[3][2] + '<br/>';
                        return res;
                    }
                },
                grid: {x:'25%',y:'20%',x2:'15%',y2:'20%'},
                xAxis : [
                    {
                        type : 'category',
                        data : axisData
                    },
                    {
                        type : 'category',
                        data : axisData,
                        axisLine:{show:false}
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        min: 0,
                        max: 13,
                        splitNumber:13,
                        axisLabel : {
                            formatter: function(v) {
                                switch (v - 5) {
                                    case 8 : return '【名次】';
                                    case 7 : return '冠军';
                                    case 6 : return '亚军';
                                    case 5 : return '第三名';
                                    case 4 : return '1/4';
                                    case 3 : return '1/8';
                                    case 2 : return '1/16';
                                    case 1 : return '1/32';
                                }
                            },
                            textStyle: {
                                color:'#fff',
                                fontSize:20
                            }
                        }
                    },
                    {
                        type : 'value',
                        min: 0,
                        max: 13,
                        splitNumber:13,
                        splitLine:{show:false},
                        axisLabel : {
                            formatter: function(v) {
                                return v == 6 ? '【场次】' : v > 6 ? '' : v;
                            },
                            textStyle: {
                                color:'#fff',
                                fontSize:20
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:teamData[curTeam].name + '历史战绩',
                        type:'line',
                        data:data
                    },
                    {
                        name:'胜',
                        type:'bar',
                        yAxisIndex:1,
                        data:teamData[curTeam].historyWin
                    },
                    {
                        name:'平',
                        type:'bar',
                        yAxisIndex:1,
                        data:teamData[curTeam].historyTie
                    },
                    {
                        name:'负',
                        type:'bar',
                        yAxisIndex:1,
                        data:teamData[curTeam].historyLose
                    }
                ]
            }, true);
        }
    }
})