define(function(require) {

    var teamData = require('./team_data');

    var $chart1 = document.getElementById('chart1');
    var $chart2 = document.getElementById('chart2');

    return {
        show: function(chart1, chart2) {

            $chart1.style.right = '0px';
            $chart1.style.width = '100%';
            $chart1.style.height = '60%';

            $chart2.style.bottom = '0px';
            $chart2.style.height = '40%';
            $chart2.style.left = '0px';
            $chart2.style.right = '0px';
            $chart2.style.width = '100%';

            chart1.resize();
            chart2.resize();


            var placeHolderStyle = {
                normal : {
                    color: 'rgba(0,0,0,0)',
                    label: {show:false},
                    labelLine: {show:false}
                },
                emphasis : {
                    color: 'rgba(0,0,0,0)'
                }
            };
            chart1.setOption({
                color:[teamData['德国'].color[0],teamData['法国'].color[0]],
                title: {
                    x: 'center',
                    y: 'center',
                    text:'粉丝对比',
                    textStyle: {
                        fontSize: 40,
                        fontWeight: 'bolder',
                        color: '#E87C25'
                    }
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    x : '53%',
                    y: '10%',
                    itemGap:20,
                    data: [
                        '德国粉丝','',
                        '法国粉丝'
                    ]
                },
                series : [
                    {
                        type: 'pie',
                        clockWise:false,
                        radius:['70%', '85%'],
                        data : [
                            {
                                name: '德国粉丝',
                                itemStyle:{normal:{
                                    //borderColor:'#fff',
                                    //borderWidth:1,
                                    label:{
                                        show:false
                                    },
                                    labelLine:{
                                        show:false
                                    }
                                }},
                                value :102851,
                            },
                            {
                                value: 44507,
                                name:'invisible',
                                itemStyle : placeHolderStyle
                            }
                        ]
                    },
                    {
                        type: 'pie',
                        clockWise:false,
                        radius:['53%', '68%'],
                        data : [
                            {
                                name: '法国粉丝',
                                itemStyle:{normal:{
                                    //borderColor:'#fff',
                                    //borderWidth:1,
                                    label:{
                                        show:false
                                    },
                                    labelLine:{
                                        show:false
                                    }
                                }},
                                value :44507,
                            },
                            {
                                value: 102851,
                                name:'invisible',
                                itemStyle : placeHolderStyle
                            }
                        ]
                    }
                ]
            }, true);
            
            
            //------------
            var st1 = {normal:{label:{show:true,position:'inside',textStyle:{fontSize:20},formatter:function(a,b,c){return c/4 + ' 胜';}}}};
            var st2 = {normal:{label:{show:true,position:'inside',textStyle:{fontSize:20},formatter:'{c} %'}}};
            chart2.setOption({
                color: ['#B5C334','#E87C25','#FCCE10'],
                color:[teamData['德国'].color[0],'#a4a4a4', teamData['法国'].color[0]],
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {type:'shadow'},
                    formatter: function(a) {
                        var win = a[0][0];
                        var name = a[0][1];
                        var value = a[0][2];
                        if (name == '交锋战绩') {
                            return name + '<br/>' +
                                   win + ' : ' + value/4 + '<br/>' +
                                   a[1][0] + ' : ' + a[1][2]/4 + '<br/>' +
                                   a[2][0] + ' : ' + a[2][2]/4;
                        }
                        else {
                            return name + '<br/>' +
                                   win + ' : ' + value + ' %<br/>' +
                                   a[1][0] + ' : ' + a[1][2] + ' %<br/>' +
                                   a[2][0] + ' : ' + a[2][2] + ' %';
                        }
                    }
                },
                legend:{
                y:'bottom',
                padding:[0,0,50,0],
                    data:['德国胜','平','法国胜']
                },
                grid:{y:5,x:'25%',x2:'15%',y2:90},
                xAxis : [
                    {
                        type : 'value',
                        splitLine:{show:false},
                        axisLabel:{show:false}
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        axisLine:{show:false},
                        axisLabel:{
                            textStyle:{
                                fontSize:20
                            }
                        },
                        data : ['交锋战绩', '球迷预测']
                    }
                ],
                series : [
                    {
                        name:'德国胜',
                        type:'bar',
                        stack:'胜负',
                        barWidth:30,
                        itemStyle:{
                            normal:{
                                borderColor:'#fff',
                                borderWidth:0
                            }
                        },
                        data: [
                            {value:36,itemStyle:st1},
                            {value:30,itemStyle:st2}
                        ]
                    },
                    {
                        name:'平',
                        type:'bar',
                        stack:'胜负',
                        barWidth:30,
                        itemStyle:{
                            normal:{
                                borderColor:'#fff',
                                borderWidth:0
                            }
                        },
                        data: [
                            {value:20,itemStyle:{normal:{label:{show:true,position:'inside',textStyle:{fontSize:20},formatter:function(a,b,c){return c/4 + ' 平';}}}}},
                            {value:30,itemStyle:st2}
                        ]
                    },
                    {
                        name:'法国胜',
                        type:'bar',
                        stack:'胜负',
                        barWidth:30,
                        itemStyle:{
                            normal:{
                                borderColor:'#fff',
                                borderWidth:0
                            }
                        },
                        data: [
                            {value:44,itemStyle:st1},
                            {value:40,itemStyle:st2}
                        ]
                    }
                ]
            }, true);
        }
    }
});