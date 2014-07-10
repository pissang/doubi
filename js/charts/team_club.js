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

            chart1.setOption({
                ntooltip : {
                    trigger: 'item',
                    position : function() {
                        var x = $('#chart-container')[0].offsetWidth / 2; 
                        return [x - 180, x]
                    },
                    formatter:function(a) {
                        var res = a[0] + '<br/>' + a[1];
                        return typeof a[3] != 'undefined'
                               ? (res + ' <-> ' + a[3])
                               : (res + ' ( ' + a[2] + '名)')
                    }
                },
                series : [
                    {
                        radius : ['45%', '55%'],
                        name:teamData[curTeam].name + '球员效力俱乐部分布',
                        type:'chord',
                        padding : 2,
                        clockWise : false,
                        itemStyle: {
                            normal: {
                                label: {
                                    rotate: true,
                                    textStyle: {
                                        fontSize: 18
                                    }   
                                }
                            }
                        },
                        data : teamData[curTeam].chordData,
                        matrix : teamData[curTeam].chordMatrix
                    }
                ]
            }, true);
        }
    }
});