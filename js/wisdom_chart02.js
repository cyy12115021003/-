 $(function(){
	 send_echo();
});
function send_echo() {       
	var echo_websocket = new WebSocket("ws://"+url+"/bigscreen-schedule/websocket/bigScreenWebSocket");   
  	echo_websocket.onopen = function () {
        console.log('websocket已连接...');
  	    echo_websocket.send("mowRightScreen");
	};
     //处理服务端返回消息
	echo_websocket.onmessage = function (event) {
   		var datas = JSON.parse(event.data);
   		console.log(event.data); //处理服务端返回消息
  	    if (datas.TSR_CODE == "0"){
  	        wisdomRight(datas)	        	
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
function wisdomRight(data){
	 //国际漫游情况
    var xDateData = [];
    var yAixRoamingData = [];					   
    var InterRoaming = data.body.InterRoaming;
    $.each(InterRoaming,function(index,obj){
		   xDateData.push(obj.date); 
		   yAixRoamingData.push(obj.value);	   						
	}); 				    
    var wisdom_chart03 = echarts.init(document.getElementById('wisdom_chart03'));
    var wisdom_option03 = {
    	tooltip: {
        	trigger: 'axis',
        	axisPointer: { // 坐标轴指示器，坐标轴触发有效
            	type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
       		 },
   		},  		
	    xAxis: {
	        type: 'category',
	        axisLine: {
	            lineStyle: {
	                color: '#51627D'
	            }
	        },
	        
	        axisLabel:{
	        	interval:0,
	        	textStyle: {
	                "color": "#fff",
	                "fontSize":16      
	           }	        	
	        },
	        splitLine: {
	            show: false,
	        },	       
	        data:xDateData 
	        //["2017/8/5", "2017/8/6", "2017/8/7", "2017/8/8","2017/8/9","2017/8/10","2017/8/11"]
	    },
	    yAxis: {
	        type: 'value',
	        axisLine: {
	            lineStyle: {
	                color: '#51627D'
	            }
	        },
	        splitLine:{
	            lineStyle:{
	                color:"#51627D"
	            }
        	},
	        axisLabel : {
                formatter: '{value}',
                textStyle: {
	                "color": "#fff",
	                "fontSize":16            
	            }
            },
	    },
	    series: [{
	        type: 'bar',
	        symbolSize: 4,
	        lineStyle: {
	            normal: {
	                color: '#EBDE20',
	                width: 2,
	            },
	        },
	        itemStyle: {
	            normal: {
	                color: "#EBDE20"
	            }
	        },
	        data:yAixRoamingData //[4,12,7,8,10,4,15]
   		 }]
	};
	wisdom_chart03.setOption(wisdom_option03);
  //分地市漫游					   
	var xAixRoaming = [];
	var yAixRoamingIn = [];
	var yAixRoamingOut = [];
	var localRoaming = data.body.localRoaming;
	$.each(localRoaming,function(index,obj){
		   xAixRoaming.push(obj.name); 
		   yAixRoamingIn.push(-obj.localIn);
		   yAixRoamingOut.push(obj.localOut);
	}); 
    var wisdom_chart04 = echarts.init(document.getElementById('wisdom_chart04'));
	var wisdom_option04 = {	
		grid:{
    		top:"10%",
    		bottom:"13%",
    		left:"12%",
    		right:"5%"
    	},
    	legend: {	
    		icon:'rect',
	    	itemWidth:20,
	    	itemHeight:10,
	    	itemGap:13,
	    	left:"center",
	        data: ['漫入', '漫出'], 	           
		    textStyle:{
		    	color:'#fff',
		    	fontSize:15
		    }		        		       	
	    },
	    tooltip: {
	        formatter: function(params) {	           
	            if (params.value < 0) {
	                return params.name + '<br/>漫入:' + -params.value
	            } else {
	                return params.name + '<br/>漫出:' + params.value
	            }
	        }
	    },
	    xAxis: {
	        type: 'category',
	        axisLine: {
	            lineStyle: {
	                color: '#51627D'
	            }
	        },
	        axisLabel: {
	        	interval :0,
	        	textStyle: {
	                "color": "#fff",
	                "fontSize":20            
	           }
	        },
	        splitLine: {
	            show: false,
	        },
	        data: xAixRoaming
	        //["南京", "无锡", "徐州", "常州","苏州","南通","连云港","淮安","盐城","扬州","镇江","泰州","宿迁"]
	    },	 
	    yAxis: [{
	        inverse: true,	
	        axisLine: {
	            lineStyle: {
	                color: '#51627D'
	            }
	        },        
	        splitLine:{
	            lineStyle:{
	                color:"#51627D"
	            }
        	},
	        splitArea: {
	            show: false
	        },
	        axisLabel: {
	        	textStyle: {
	                "color": "#fff",
	                "fontSize":16         
	            },
	            formatter: function(value) {
	                if (value < 0) {
	                    return -value
	                } else {
	                    return value
	                }
	            }
	        }
	
	    }],	    
	    series: [{	        
	        type: 'bar',
	        stack: 'one',
	        name: "漫出",
	        itemStyle: {
	        	normal: {
	                color: "#FFCA6A"
	            }
	        },
	         data:yAixRoamingOut
	         //[11130, 2010, 2150, 3180, 5510, 6010, 4001,2331,1231,3441,3211,2717,3212]
	       
	    },{	        
	        type: 'bar',
	        stack: 'one',
	        name: "漫入",
	        itemStyle:{
	        	normal: {
	                color: "#4DBFFF"
	            }
	        },
	        barWidth : 15,
	        data: yAixRoamingIn
	        //[-11200, -21150, -2190, -4150, -5190, -7100, -1600,-1100,-1123,-2150,-3130,-3415,-4130]
	    }]
    };
    wisdom_chart04.setOption(wisdom_option04);
	     //最右边数据
	$("#alarmNumber").text(data.body.alarAll.value);
	if(data.body.alarAll.status == "0"){
		$("#alarmNumber").next().text("正常");
	}else{
		$("#alarmNumber").next().text("不正常");
	}
	$("#alarImportNumber").text(data.body.alarImport.value);
	if(data.body.alarImport.status == "0"){
		$("#alarImportNumber").next().text("正常");
	}else{
		$("#alarImportNumber").next().text("不正常");
	}
	$("#orderNumber").text(data.body.orderAll.value);
	if(data.body.orderAll.status == "0"){
		$("#orderNumber").next().text("正常");
	}else{
		$("#orderNumber").next().text("不正常");
	}
	//表格
	var alarmLists = "";
	for(var i=0;i<data.body.alarFormdata.length;i++){
		alarmLists+='<tr class="wl-table-list"><td>'+
			data.body.alarFormdata[i].name+'</td><td>'+
			data.body.alarFormdata[i].alar+'</td><td>'+
			data.body.alarFormdata[i].order+'</td><td>'+
			data.body.alarFormdata[i].officeOrder+'</td><tr>';
	}
	$("#alarList").html(alarmLists);
	//重大障碍升级
	var maj_upgradList = "";
	for(var j=0;j<data.body.majUpgrad.length;j++){
		maj_upgradList+='<span>'+data.body.majUpgrad[j]+'</span>';
	}
	$("#scroll_begin01").html(maj_upgradList);
	ScrollImgLeft1();
	//风险操作
	    var risk_operatList = "";
	    var risklength = data.body.riskOperat.length;
	    for(var m =0;m<risklength;m++){
	    	$("#riskLength").html('('+risklength+')');
	    	risk_operatList+='<span>'+(m+1)+':'+data.body.riskOperat[m]+'</span>';
	    }
	    $("#scroll_begin02").html(risk_operatList);
	    ScrollImgLeft2();
}
