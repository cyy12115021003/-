$(function(){
	echarts.registerMap('jiangsuJson', jiangsuJson);
	send_echo();
});
function send_echo() {       
	var echo_websocket = new WebSocket("ws://"+url+"/bigscreen-schedule/websocket/bigScreenWebSocket");   
  	echo_websocket.onopen = function () {
        console.log('websocket已连接...');
  	    echo_websocket.send("idcMiddleScreen");
	};
     //处理服务端返回消息
	echo_websocket.onmessage = function (event) {
   		var datas = JSON.parse(event.data);
  	    console.log("IDC云----------"+event.data); //处理服务端返回消息
  	    if (datas.TSR_CODE == "0"){  	        	 	        	
  	        IDCMiddle(datas)	        	
		}else if(datas.TSR_CODE == "1"){	
			//alert("请输入正确的专业代码");				
		}		
    };
    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
  	    window.onbeforeunload = function () {  
           closeWebSocket();  
        }  
        //关闭WebSocket连接  
        function closeWebSocket() {  
           echo_websocket.close();  
        }   
    //websocket断开
   	echo_websocket.onclose = function (event) {
    	console.log('websocket已关闭...');
    	//alert("WebSocket连接已关闭");
	};		
}
function IDCMiddle(data){
	//全省IDC机架量
	$("#totalShow").html('('+data.body.IDCframe.totalShow.rent+' / '+data.body.IDCframe.totalShow.frame+')');
	//在租机架量TOP3
	var idcTopLists = "",rentTopThr = data.body.IDCframe.mapShow;
	for(var i=0;i<3;i++){
		idcTopLists+='<div class="wl-skip-box wl-i8">'+
				'<div class="wl-skip-label">'+(i+1)+'</div>'+
				'<div class="wl-i9">'+rentTopThr[i].name+'</div>'+
				'<div>机架量:'+rentTopThr[i].frame+'</div>'+
				'<div>在租机架量:'+ rentTopThr[i].rent+'</div>'+
			'</div>';
	}
    $("#idcTopDiv").html(idcTopLists);
    var IDC_chart_Map = echarts.init(document.getElementById('IDC_chart_Map'));
    var IDCMap_option = {   	
        tooltip: {
            trigger: 'item',  
            formatter: function(params) {  
             	return params.name + ':<br/>机架量:'+ params.data.frame + '<br/>在租机架量:' + params.data.rent;                                           
            }   
        },          				        
        series: [{       	
            type: 'map',
            mapType:'jiangsuJson',
            label: {
                normal: {
                    show: true,
                    textStyle:{
                    	color: '#fff'
                    }
                },
                emphasis: {
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#389BB7',//蓝色
                    borderWidth: 2,
                    color: function(params) {                    	
	                    var tmp = params.data.rent;
	                    if (tmp>=2000) {
		                    return '#524D15';
		                } else if (200<tmp&&tmp<2000) {
		                    return '#75AC47';
		                } else{
		                    return '#C0E586';
		                }
	                }                   
                },
                emphasis: {
                    areaColor: '#389BB7',
                    borderWidth: 0
                }
            },
            animation: true,           
	        data:rentTopThr
	        /*[
	            {name: '南京市', jzvalue: 100,dzvalue:50,type:1},	            
	            {name: '苏州市', jzvalue: 70,dzvalue:70,type:1},
	            {name: '镇江市', jzvalue: 20,dzvalue:20,type:1},
	            {name: '淮安市', jzvalue: 30,dzvalue:30,type:0},
	            {name: '常州市', jzvalue: 40,dzvalue:35,type:0},
	            {name: '南通市', jzvalue: 4,dzvalue:1,type:0},
	            {name: '盐城市', jzvalue: 15,dzvalue:12,type:2},
	            {name: '扬州市', jzvalue: 25,dzvalue:11,type:2},
	            {name: '宿迁市', jzvalue: 35,dzvalue:25,type:1},
	            {name: '无锡市', jzvalue: 10,dzvalue:3,type:0},
	            {name: '连云港市',jzvalue: 55,dzvalue:35,type:2},
	            {name: '徐州市', jzvalue: 85,dzvalue:13,type:1},
	            {name: '泰州市', jzvalue: 5,dzvalue:3,type:0}
	        ]	      */          
        }]
	};
   
    IDC_chart_Map.setOption(IDCMap_option);
     
    // IDC重点客户流量占比   
    var IDC_chart01 = echarts.init(document.getElementById('IDC_chart01'));
    /*var originalData = [
	    {value:100,name:'腾讯'},
	    {value:335, name:'爱奇艺'},
	    {value:679, name:'淘宝'},
	    {value:848, name:'百度'},
	    {value:348, name:'天猫'}
         
 	];*/
	var IDC_option01 = {	    
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)",
    	},    
	    series: [   
	        {
	            name:'IDC重点客户流量占比',
	            type:'pie',
	            radius: ['42%', '55%'],
	            color: ['#FA4D41', '#FF9B28','#19BFFF','#28EFFF','#FFEE33'],
	            label: {
	                normal: {
	                    formatter: '{b}:{d}%',
	                    textStyle:{
		                   fontSize:20  
		                }
	                },
	          		
	            },
	            data:data.body.idcKeyCustomer
	        }
	    ]
	};
	IDC_chart01.setOption(IDC_option01);
    //各地市流量流向
    var xAxisFlowJson = [];  
	var innerJson = [];    
	var outerJson = [];      					
	var flowDirect = data.body.flowDirect;
	$.each(flowDirect,function(index,obj){
		xAxisFlowJson.push(obj.name);
		innerJson.push(obj.in); 	
		outerJson.push(obj.out);   						
	});   	
    var IDC_chart02 = echarts.init(document.getElementById('IDC_chart02'));
    var bcBySeriesIndex = ['A','A'];
    var IDC_option02 = {
    	color: ['#4DBFFF','#FFCA6A'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        },
	        formatter: function (params) {
	            var html = [];
	            var category = {};
	            echarts.util.each(params, function (param) {
	                var catName = param.seriesName;
	                var bc = bcBySeriesIndex[param.seriesIndex];
	                if (!category[catName]) {
	                    category[catName] = {};
	                }
	                category[catName][bc] = param.value;
	            });
	            echarts.util.each(category, function (cate, key) {
	                html.push(
	                    '<tr>',
	                    '<td>', key, '</td>',
	                    '<td>', cate.A, '</td>',
	                    '</tr>'
	                );
	            })
	            
	            return '<table border=1>'
	                + '<tr><td></td></tr>' 
	                + html.join('') 
	                + '</table>';
	        }
	    },
	    legend: {
	        data: [
	            '省内','省际'
	        ],
	        textStyle:{
		        color:'#fff',
		        fontSize:18
		    }	
	    },
	    grid: {
	        left: '5%',
	        right: '4%',
	        bottom: '10%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data :xAxisFlowJson,
	            //['南京','无锡','徐州','常州','苏州','南通','连云港','淮安','盐城','扬州','镇江','泰州','宿迁'],
	            axisTick: {
		            alignWithLabel: true
		        },
		        axisLabel: {
	                show: true,
	                interval:0,
	                rotate:50,
	        	    margin:5,
	                textStyle: {
	                    color: '#fff',
	                    "fontSize":18
	                }
	            },
				axisLine: {
		            lineStyle: {
		                color: '#51627D'
		            }
	       		 },
	       		splitLine: {
	            	show: false,
	        	}
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            axisLabel: {
	                show: true,
	                textStyle: {
	                    color: '#fff'
	                }
	            },
	            axisLine: {
		            lineStyle: {
		                color: '#51627D'
		            }
	        	}, 
	        	splitLine:{
		            lineStyle:{
		                color:"#51627D"
		            }
        		}
	        }
	    ],
	    series : [
	        
	        {
	            name:'省际',
	            type:'bar',
	            stack: 'B',
	            data:outerJson
	            //[320, 332, 301, 334, 390, 330, 320,500,311,430,360,412,355]
	        },
	        {
	            name:'省内',
	            type:'bar',
	            barWidth : 20,
	            stack: 'B',
	            barWidth:15,
	            data:innerJson
	            //[120, 132, 101, 134, 90, 230, 210,150,170,20,75,99,150]
	        }
	    ]
    };
    IDC_chart02.setOption(IDC_option02);
}
