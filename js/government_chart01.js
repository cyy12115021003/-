$(function(){
	echarts.registerMap('jiangsuJson', jiangsuJson);
	send_echo();
});
function send_echo() {       
	var echo_websocket = new WebSocket("ws://"+url+"/bigscreen-schedule/websocket/bigScreenWebSocket");   
  	echo_websocket.onopen = function () {
        console.log('websocket已连接...');
  	    echo_websocket.send("govMiddleScreen");
	};
     //处理服务端返回消息
	echo_websocket.onmessage = function (event) {
   		var datas = JSON.parse(event.data);
  	    console.log("政企服务_--------------"+event.data); //处理服务端返回消息
  	    if (datas.TSR_CODE == "0"){  	        	 	        	
  	        governMiddle(datas)	        	
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
function governMiddle(data){
	var goverTopLists = "",digitalCAndBroadBline = data.body.digitalCAndBroadBline,topThr = digitalCAndBroadBline.mapShow;
	$("#totalShow").html('('+ digitalCAndBroadBline.totalShow.digitalC/*+' / '+data.body.digitalCAndBroadBline.totalShow.broadBline*/+')');
	 //装机Top3	
	for(var i=0;i<3;i++){
		goverTopLists+='<div class="wl-skip-box wl-i8">'+
				'<div class="wl-skip-label">'+(i+1)+'</div>'+
				'<div class="wl-i9">'+topThr[i].name+'</div>'+
				'<div>电路数:'+topThr[i].digitalC+'</div>'+
			'</div>';
	}
    $("#governmentTopDiv").html(goverTopLists);
	//全地市数字电路/宽带专线数量
    var government_chart_Map = echarts.init(document.getElementById('government_chart_Map'));
    var governmentMap_option = {   	
        tooltip: {
            trigger: 'item',  
            formatter: function(params) {  
             	return params.name + ':<br/>电路数:'+ params.data.digitalC /*+ '<br/>宽带数:' + params.data.broadBline*/;                                           
            }  
        },               				        
        series: [{       	
            type: 'map',
            mapType:'jiangsuJson',
            label: {
                normal: {
                    show: true,
                    textStyle:{
                    	color: '#fff',
                     	fontSize:20  
                    }
                },
                emphasis: {
                    textStyle: {
                        color: '#fff',
                        fontSize:20  
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#389BB7',//蓝色
                    borderWidth: 2,
                    color: function(params) {                    	
	                    var tmp = params.data.digitalC;
	                    if (tmp>=8000) {
		                    return '#524D15';
		                } else if (4000<tmp&&tmp<8000) {
		                    return '#75AC47';
		                } else if (4000>=tmp){
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
	        data:topThr				          
        }]
	};				   
    government_chart_Map.setOption(governmentMap_option);
   
    //政企客户告警走势
    var xAixTime = [], yAixData = [];
    var govAlarTrend = data.body.govAlarTrend;
    $.each(govAlarTrend.reverse(),function(index,obj){
		xAixTime.push(obj.time.substring(5,16)); 
		yAixData.push(obj.value);
	}); 
    var government_chart01 = echarts.init(document.getElementById('government_chart01'));				   					
	var government_option01 = {	    
	    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
	    xAxis: {					       
	        axisLine: {lineStyle: {color: '#51627D'}},
	        nameTextStyle: {fontSize: 4},
			axisLabel:{rotate:30, textStyle: {"color": "#fff", "fontSize":12}},
	        splitLine: {show: false},
	        data:xAixTime					        
	    },
	    yAxis: {
	        type: 'value',
	        axisLine: {lineStyle: {color: '#51627D'}},
	        splitLine:{lineStyle:{color:"#51627D"}},
	        axisLabel : {formatter: '{value}', textStyle: {color: "#fff", fontSize: 20}}
	    },
	    series:[{
	        type: 'line',
	        symbolSize: 6,
	        showAllSymbol: true,
	        lineStyle: {normal: {color: '#EBDE20', width: 2}},
	        itemStyle: {normal: {color: "#EBDE20"}},
	        data:yAixData
	        
   		 }]
	};									
	government_chart01.setOption(government_option01);
    //政企客户申告情况
    var xAixBarriersTime = [], yAixBarriersData = [], govCusBarriers = data.body.govCusbarriers.reverse();
    $.each(govCusBarriers,function(index,obj){
		xAixBarriersTime.push(obj.time.substring(5,16)); 
		yAixBarriersData.push(obj.value);
	}); 
    var government_chart02 = echarts.init(document.getElementById('government_chart02'));
    var government_option02 = {
    	tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
	    xAxis: {
	        type: 'category',
	        axisLine: {lineStyle: {color: '#51627D'}},
	        axisLabel:{rotate:30, textStyle: {color: "#fff", fontSize: 12}},
	        splitLine: {show: false},
	        data:xAixBarriersTime	       
	    },
	    yAxis: {
	        type: 'value',
	        axisLine: {lineStyle: {color: '#51627D'}},
	        splitLine:{lineStyle:{color:"#51627D"}},
	        axisLabel : {
                formatter: '{value}',
                textStyle: {"color": "#fff", "fontSize":20}
            }
	    },
	    series: [{
	        type: 'line',
	        showAllSymbol: true,
	        symbolSize: 6,
	        lineStyle: {normal: {color: '#3E9EDC', width: 2}},
	        itemStyle: {normal: {color: "#3E9EDC"}},
	        data:yAixBarriersData
   		 }]
    };
    government_chart02.setOption(government_option02);
}
