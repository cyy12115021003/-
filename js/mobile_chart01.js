    $(function(){
	    echarts.registerMap('jiangsuJson', jiangsuJson);
	    send_echo();
	});
    function send_echo() {       
	    	var echo_websocket = new WebSocket("ws://"+url+"/bigscreen-schedule/websocket/bigScreenWebSocket");   
	      	echo_websocket.onopen = function () {
	            console.log('websocket已连接...');
	      	    echo_websocket.send("moveMiddleScreen");
	    	};
	         //处理服务端返回消息
	   		echo_websocket.onmessage = function (event) {
		   		var datas = JSON.parse(event.data);
		  	    console.log(event.data); //处理服务端返回消息
		  	    if (datas.TSR_CODE == "0"){  	        	 	        	
		  	        mobileMiddle(datas);	        	
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
	        //	alert("WebSocket连接已关闭");
	    	};		
    }
    
    function mobileMiddle(data){
	    	 //全省基站服务情况
	    	$("#totalShow").html('('+data.body.basestaService.totalShow.station+' / '+data.body.basestaService.totalShow.lose+')');
	    	//掉站Top3			
			var mobileTopLists = "",loseTop = data.body.basestaService.mapShow;
			for(var i=0;i<3;i++){
				mobileTopLists+='<div class="wl-skip-box wl-i8">'+
						'<div class="wl-skip-label">'+(i+1)+'</div>'+
						'<div class="wl-i9">'+loseTop[i].name+'</div>'+
						'<div>基站数:'+(parseInt(loseTop[i].thrG)+parseInt(loseTop[i].fouG)).toString()+'</div>'+
						'<div>掉站数:'+(parseInt(loseTop[i].thrGFau)+parseInt(loseTop[i].fouGFau)).toString()+'</div>'+
					'</div>';
			}
		    $("#mobileTopDiv").html(mobileTopLists);
		    var mobile_chart_Map = echarts.init(document.getElementById('mobile_chart_Map'));
		    var mobileMap_option = {   	
		        tooltip: {
		            trigger: 'item', 		           
		            formatter: function(params) {  
		            	// console.log(params);
		             	return params.name + ':<br/>3G基站数:'+ params.data.thrG + '<br/>3G掉站数:' + params.data.thrGFau+'<br/>4G基站数:' + params.data.fouG+'<br/>4G掉站数:' + params.data.fouGFau;                                           
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
			                    var tmp = (parseInt(params.data.thrGFau) + parseInt(params.data.fouGFau)).toString();	
			                    if (tmp>=150) {
		                       	 	return '#FA4D41';
		                    	} else if (100<tmp&&tmp<150) {
		                       		return '#FF9B28';		                       		
		                    	} else{
		                       		return 'green';	                       	
		                   		}
			                }                
		                },
		                emphasis: {
		                    areaColor: '#389BB7',
		                    borderWidth:2		                     		                   	               
		                }
		            },
		            animation: true,           
			        data:data.body.basestaService.mapShow	               
		        }]
			};
			 mobile_chart_Map.setOption(mobileMap_option);
	
			
			//各地市感知优良率		
			var xcityData = [],regPerceRate = data.body.regPerceRate;
			$.each(regPerceRate,function(index,obj){
				xcityData.push(obj.name);  						 						
			});   	
			 var mobile_chart01 = echarts.init(document.getElementById('mobile_chart01'));
			 var mobile_option01 = {	    
			    "tooltip": {
			        "trigger": "axis",
			        "axisPointer": { // 坐标轴指示器，坐标轴触发有效
			            "type": "shadow" // 默认为直线，可选为："line" | "shadow"
			        },
			        formatter:"{a}<br/>{b}:{c}%"	        
			    },
			    grid:{
			    	top:"5%",
			    	bottom:"5%",
			    	right:"2%",
			    	left:"5%",	    	
			    	containLabel: true
			    },
			    "yAxis": [{
			        "type": "category",
			        "data": xcityData,
			        //["扬州", "淮安", "泰州", "徐州","盐城", "宿迁", "连云港", "南通", "苏州","常州", "无锡", "镇江", "南京"],
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
			        "min": "80.00",
                    "max": "100.00",
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
			
			    "series": [{
			        "name": "各地市感知优良率",
			        "type": "bar",
			        "data": data.body.regPerceRate,
			        "barWidth":12,			        
			        "label": {
			            "normal": {
			                "show": true,
			                "position": "right",
			                "formatter": function(params) {
			                    return params.data.value+"%";
			                },
			                "textStyle": {
			                    "color": "#fff",
			                    fontSize:15  
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
			mobile_chart01.setOption(mobile_option01);
			//语音掉话率
			var xAxisDataJson = [];  
			var seriesDataJson = []; 
			var voiceDropRate = data.body.voiceDropRate;
			$.each(voiceDropRate,function(index,obj){
				xAxisDataJson.push(obj.name);
				seriesDataJson.push(obj.value);  
			});  					
		    var mobile_chart02 = echarts.init(document.getElementById('mobile_chart02'));
		    var mobile_option02 = {
		    	tooltip: {
		        	trigger: 'axis',
		        	axisPointer: { 
		            	type: 'shadow' 
		       		},
		       		formatter: function(params) {				       			
			            var normal = '';           
			            normal = '语音掉话率:<br/>'+params[0].name+':'+ params[0].data+'%';           	
			            return normal;         
			        }
		   		},
		   		grid:{
		   			left:"10%",
		   			right:"5%",
		   			top:"8%",
		   			bottom:"15%"
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
			        	rotate:45,
			        	textStyle: {
			                "color": "#fff",
			                "fontSize":15           
			           }	        	
			        },
			        splitLine: {
			            show: false,
			        },	       
			        data:xAxisDataJson /*["南京", "镇江", "无锡", "常州","苏州","南通","连云港","宿迁","盐城","徐州","泰州","淮安","扬州"]*/
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
		                formatter: '{value}%',
		                textStyle: {
			                "color": "#fff",
			                "fontSize":15           
			            }
		            },
			    },
			    series: [{
			        type: 'line',
			        symbolSize: 6,
			        lineStyle: {
			            normal: {
			                color: '#FDC96A',
			                width: 2,
			            },
			        },
			        itemStyle: {
			            normal: {
			                color: "#FDC96A"
			            }
			        },
			        data: seriesDataJson
		   		 }]
		    };
	   		mobile_chart02.setOption(mobile_option02);
    }
   