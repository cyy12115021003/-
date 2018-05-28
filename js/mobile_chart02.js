	$(function(){
		send_echo();
	});
	//websocket
	function send_echo() {       
    	var echo_websocket = new WebSocket("ws://"+url+"/bigscreen-schedule/websocket/bigScreenWebSocket");   
      	echo_websocket.onopen = function () {
            console.log('移动右屏——————————websocket已连接...');
      	    echo_websocket.send("moveRightScreen");
    	};
         //处理服务端返回消息
   		echo_websocket.onmessage = function (event) {
	   		var datas = JSON.parse(event.data);
	   		console.log(event.data); //处理服务端返回消息
	  	    if (datas.TSR_CODE == "0"){
	  	        mobileRight(datas)	        	
			}
  	    };
  	    window.onbeforeunload = closeWebSocket;
		function closeWebSocket() {
           echo_websocket.close();  
        }  
 	   	echo_websocket.onclose = function (event) {
        	console.log('websocket已关闭...');
    	};
    }
    
	function mobileRight(data){
		//移动互联网应用排名
		var mobile_chart03 = echarts.init(document.getElementById('mobile_chart03'));
		var xAxisTop10 = [];var topTen = data.body.appRankTen;
		$.each(topTen,function(index,obj){
			xAxisTop10.push(obj.name);
		});
	    var mobile_option03 = {
		    tooltip: {
			    trigger: "axis", axisPointer: {type: "shadow"}, formatter: function (params) {
			    	var data = params[0].data;
				    return data.name + ':' + data.value + '万';
			    }
		    },
		    grid:{top:"1%", bottom:"5%", right:"15%", left:"3%", containLabel: true},
	    	yAxis: [{
		        type: "category",
		        data: xAxisTop10,
		        axisLine: {show: true},
		        axisTick: {show: true, alignWithLabel: true},
		        axisLabel: {interval:0, textStyle: {color: "#fff", fontSize: 15}}
		    }],
		    xAxis: [{
		        type: "value",
		        axisLine: {show: false},
		        axisTick: {show: false},
		        axisLabel: {show: false},
		        splitLine: {show: false}
		    }],
	    	title:[{text:"应用排名Top10", left:'44%', top:'88%', textAlign: 'center', textStyle: {"color": '#fff', "fontSize": 25}}],
		    series: [{
		     	name:"应用排名Top10", type: "bar", data:topTen, barWidth:10,
		        label: {normal: {show: true, position: "right", textStyle: {color: "#fff"}}},
		        itemStyle: {normal: {color: '#62CEEF', label: {
			        formatter: function (params) {
				        return  params.value + '万';
			        }
		        }}}
		     }]
	    };
    	mobile_chart03.setOption(mobile_option03);
    	
    var mobile_chart05 = echarts.init(document.getElementById('mobile_chart05'));
    var xAxisTop5 = [];  				
	var topFiv = data.body.appRankFiv;
	$.each(topFiv,function(index,obj){
		xAxisTop5.push(obj.name);			
	});   							   					
    var mobile_option05 = {     	
    	"tooltip": {
	        "trigger": "axis",
	        "axisPointer": { // 坐标轴指示器，坐标轴触发有效
	            "type": "shadow" // 默认为直线，可选为："line" | "shadow"
	        }	             
	    },
	    "grid":{
	    	top:"6%",
	    	bottom:"5%",
	    	right:"3%",
	    	left:"8%",	    	
	    	containLabel: true
	    },
    	"yAxis": [{
	        "type": "category",
	        "inverse": true,	
	        "position":"right",
	        "data": xAxisTop5,
	        "axisLine": {
	            "show": true
	        },
	        "axisTick": {
	            "show": true,
	            "alignWithLabel": true
	        },
	        "axisLabel": {
	        	"interval":0,
	            "textStyle": {
	                "color": "#fff",
	                "fontSize":15             
	            }
	        }
	    }],
	    "xAxis": [{
	        "type": "value",
	        "inverse": true,	        
	        "axisLine": {
	            "show": false
	        },
	        "axisTick": {
	            "show": false
	        },
	        "axisLabel": {
	            "show": false
	        },
	        "splitLine": {
	            "show": false
	        }
	    }],
	
    	title:[
    		{
	    		text:"应用上升排名Top5",
	    		left:'44%',
		        top:'88%',
		        textAlign: 'center',
		        textStyle: {
		            "color": '#fff',
		            "fontSize":25   
		        }
	        }
    	],
	    series: [{
	     	name:"应用上升Top5",
	     	type: "bar",	        	         
	        data:topFiv ,
	        "barWidth":15,	        
	        "label": {
	            "normal": {
	                "show": true,
	                "position": "left",	                
	                "textStyle": {
	                    "color": "#fff"
	                }
	            }
	        },
	        "itemStyle": {
	            "normal": {
	                "color": '#FFB347'
	            }
	        }
	     }]
    };
    mobile_chart05.setOption(mobile_option05);
	    //寻呼成功率/接通成功率
	    var xAxisDataJson = [];  
		var seriesDataJson1 = []; 
		var seriesDataJson2 = []; 
		var pagingAndConnectSuccRate = data.body.pagingAndConnectSuccRate;
		$.each(pagingAndConnectSuccRate,function(index,obj){
			xAxisDataJson.push(obj.name);
			seriesDataJson1.push(obj.paging); //寻呼成功率
			seriesDataJson2.push(obj.connect); //接通成功率
		});   							   					
	    var mobile_chart04 = echarts.init(document.getElementById('mobile_chart04'));
	    var mobile_option04 = { 
	    	grid:{
	    		top:"10%",
	    		bottom:"13%",
	    		left:"10%",
	    		right:"3%"
	    	},
			tooltip:{
				trigger:'axis'
			},
		    xAxis: {
		        type: 'category',
		        axisLine: {
		            lineStyle: {
		                color: '#51627D'
		            }
		        },
		        axisLabel: {
		        	"interval":0,
		        	textStyle: {
		                "color": "#fff",
		                "fontSize": 15           
		           }
		        },
		        splitLine: {
		            show: false,
		        },					        
		        data:xAxisDataJson			      
			},					    
		    legend: {  
		    	icon:'rect',
		    	itemWidth:30,
		    	itemHeight:20,
		    	itemGap:15,
		    	x:"right",
		        data: ['寻呼成功率','接通成功率'],     	           
			    textStyle:{
			    	color:'#fff',
			    	fontSie:30
			    }		        		       	
		    },    
		    yAxis: {
		        type: 'value',
		         min:"50.00",	
		         max:"100.00",		
		        axisLine: {
		            lineStyle: {
		                color: '#51627D'
		            }
		        },
		        axisLabel : {
		            formatter: '{value}%',
		            textStyle: {
		                "color": "#fff",
		                "fontSize":15        
		            }
		        },
		        splitLine:{
		            lineStyle:{
		                color:"#51627D"
		            }
	        	}
		        
			},
		   
		    series: [{ 
		    	symbolSize: 6,
		        lineStyle: {
		            normal: {
		                color: '#FEC96A',
		                width: 2,
		            },
		        },
		        itemStyle: {
		            normal: {
		                color: "#FEC96A"
		            }
		        },
		        name: "寻呼成功率",
		        type: 'line',
		        data:seriesDataJson1   
		    },
		    {
		    	symbolSize: 6,
		        lineStyle: {
		            normal: {
		                color: '#62CEEF',
		                width: 2,
		            },
		        },
		        itemStyle: {
		            normal: {
		                color: "#62CEEF"
		            }
		        },
		        name: "接通成功率",
		        type: 'line',
		        data:seriesDataJson2
		    }]
    	};
    	mobile_chart04.setOption(mobile_option04);
		//最右边数据
		//全省告警数
		$("#alarmNumber").text(data.body.alarAll.value);
		if(data.body.alarAll.status == "0"){
			$("#alarmNumber").next().text("正常");
		}else{
			$("#alarmNumber").next().text("不正常");
		}
		//全省重要告警数
		$("#alarImportNumber").text(data.body.alarImport.value);
		if(data.body.alarImport.status == "0"){
			$("#alarImportNumber").next().text("正常");
		}else{
			$("#alarImportNumber").next().text("不正常");
		}
		//全省工单数
		$("#orderNumber").text(data.body.orderAll.value);
		if(data.body.orderAll.status == "0"){
			$("#orderNumber").next().text("正常");
		}else{
			$("#orderNumber").next().text("不正常");
		}
		//表格:专业、告警数、工单数、分公司工单
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
	    
	   
	   