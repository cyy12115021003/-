    var alertImg = document.getElementById('alertImg');    
    $(function(){
	    echarts.registerMap('jiangsuJson', jiangsuJson);
	    send_echo();
	});
    function send_echo() {       
	    	var echo_websocket = new WebSocket("ws://"+url+"/bigscreen-schedule/websocket/bigScreenWebSocket");   
	      	echo_websocket.onopen = function () {
	            console.log('十九大=====全省基站服务情况、各地市宽带/itv在线用户数、websocket已连接...');
	      	    echo_websocket.send("nineteenGMiddleScreen");
	    	};
	         //处理服务端返回消息
	   		echo_websocket.onmessage = function (event) {
		   		var datas = JSON.parse(event.data);
		   		  console.log(event.data); //处理服务端返回消息
		  	    if (datas.TSR_CODE == "0"){  	        	 	        	
		  	        baozhangMiddle(datas);	        	
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
    
    function baozhangMiddle(data){
	    	 //全省基站服务情况
	    	$("#totalShow").html('('+data.body.basestaService.totalShow.station+' / '+data.body.basestaService.totalShow.lose+')');
	    	//掉站Top3			
			var mobileTopLists = "";
			var loseTop = data.body.basestaService.mapShow;
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
		    mobileMap_option = {   	
		        tooltip: {
		            trigger: 'item', 		           
		            formatter: function(params) {  		            	
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
		                       	 	return '#524D15';
		                    	} else if (100<tmp&&tmp<150) {
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
			        data:data.body.basestaService.mapShow	               
		        }]
			};
			 mobile_chart_Map.setOption(mobileMap_option);
	
			//itv	
			var xAxisJson = [];  
			var broadJson = []; 
			var itvJson = []; 
			var broadBAndItvOnline = data.body.broadBAndItvOnline;
			$.each(broadBAndItvOnline,function(index,obj){
				xAxisJson.push(obj.name);
				broadJson.push(obj.broad); //宽带用户数
				itvJson.push(obj.itv); //iTV在线用户数
			});   							   					
		    var baozhang_chart01 = echarts.init(document.getElementById('baozhang_chart01'));
		    var baozhang_option01 = {   	
				tooltip:{
					trigger:'axis'
				},
				grid:{
		   			left:"17%"  			
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
			        	rotate:45,
			        	margin:5,
			        	textStyle: {
			                "color": "#fff",
			                "fontSize":20            
			           }
			        },
			        splitLine: {
			            show: false,
			        },	        
			        data:xAxisJson		     
				},
			    legend: {  
			    	icon:'rect',
			    	itemWidth:20,
			    	itemHeight:10,
			    	itemGap:13,
			    	left:"right",
			        data: ['宽带在线数','iTV在线数'],     	           
				    textStyle:{
				    	color:'#fff'
				    }		        		       	
			    },    
			    yAxis: {
			        type: 'value',
			        axisLine: {
			            lineStyle: {
			                color: '#51627D'
			            }
			        },
			        axisLabel : {
			            formatter: '{value}万',
			            textStyle: {
			                "color": "#fff",
			                "fontSize":20          
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
			        name: "宽带在线数",
			        type: 'line',
			        data:broadJson		     
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
			        name: "iTV在线数",
			        type: 'line',
			        data:itvJson		      
			    }]
		    };
		    baozhang_chart01.setOption(baozhang_option01);
		    
		    
		    //重要告警
		    var alarLists = "";
		    var lengthhh = data.body.importAlarm.length;
		    $("#tiaoshu").text('('+lengthhh+'条)');		    
		    if(lengthhh==0){
		    	alertImg.src="images/ludeng.png";
		    	$("#scrollList").html('<li>暂无重要告警。</li>');		    
		    	$("#alertImg").removeClass("shanshan");		    	
		    }else if(lengthhh>0){		    	
		    	alertImg.src="images/reddeng.png";
		    	for(var j=0;j<lengthhh;j++){
		    		alarLists+='<li>'+(j+1)+'、'+data.body.importAlarm[j]+'</li>';
		    	}
			    $("#scrollList").html(alarLists);			    
			    $("#alertImg").addClass("shanshan");
				huadong();					
			}				
    }    
    
    $("#scrollCon ul.scrollList").clone().appendTo($("#scrollCon"));   
    function huadong(){
    	var scrollList = document.getElementById("scrollList"); 
    	if(window._MyMar){
			clearInterval(window._MyMar);
			window._MyMar = null;　　　　
		}
    	function marquee(){
			if($("#scrollDiv").scrollTop() > $("#scrollCon ul.scrollList").height()){
				$("#scrollDiv").scrollTop(0);
			}else{
				$("#scrollDiv").scrollTop($("#scrollDiv").scrollTop() + 1);
			}
		}
		window._MyMar=setInterval(marquee,50);
		scrollList.onmouseover = function(){　　　　　　
			　clearInterval(window._MyMar);　　　　
		}　　　　
		scrollList.onmouseout = function(){　　　　　　
			　window._MyMar= setInterval(marquee,50);　　　　
		}  
    }
    
	