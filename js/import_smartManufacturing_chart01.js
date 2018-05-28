	  var alertImg = document.getElementById('alertImg');  
	$(function(){
		send_echo();
	});
	//websocket
	function send_echo() {       
    	var echo_websocket = new WebSocket("ws://"+url+"/bigscreen-schedule/websocket/bigScreenWebSocket");   
      	echo_websocket.onopen = function () {
            console.log('制造智能大会中屏--------websocket已连接...');
      	    echo_websocket.send("keyGuaranteeMiddleScreen");
    	};
         //处理服务端返回消息
   		echo_websocket.onmessage = function (event) {
	   		var datas = JSON.parse(event.data);
	   		console.log("制造智能大会中屏-------"+event.data); //处理服务端返回消息
	  	    if (datas.TSR_CODE == "0"){
	  	        keyGuaranteeMiddle(datas)	 	  	      
			}
  	    };
  	    window.onbeforeunload = closeWebSocket;
		function closeWebSocket() {
           echo_websocket.close();  
        }  
 	   	echo_websocket.onclose = function (event) {
        	console.log('制造智能大会中屏--------websocket已关闭...');
    	};
    }
	
	var chartDivPreId = 'chartDivPreId_';
	function keyGuaranteeMiddle(data){		
		var hotelList = "",items = data.body, toShowChartsData = [], curDivId, item,sum = 0;
		for(var i=0;i<items.length;i++){
			curDivId = chartDivPreId+ i;
			item = {domId : curDivId}
			var num = parseInt(items[i].alarNum);		
			sum += num;
			hotelList+='<div class="dp-k4 dp-a6 dp-m1">'+
				'<div class="dp-font-blue3 dp-i7 dp-font-weight">人流量：'+items[i].flowNum+'</div>'+
				'<div class="dp-font-red dp-font-weight dp-i7 dp-t1">'+items[i].alarNum+'</div>'+
				'<div class="dp-echart" id="'+ curDivId +'"></div>'+
				'<div class="dp-font-blue2 dp-i6 dp-m1 dp-t4 dp-font-weight" style="line-height: 40px;font-size:15px;">'+items[i].name+'</div>'+
				'<div class="dp-t4">'+
				'<img src="'+items[i].pic+'" style="width: 186px;height: 186px;">'+
				'</div></div>';	
				item.chartData = items[i].flowNum;
			toShowChartsData.push(item)
		}
	    $("#hotelDiv").html(hotelList);
	    $('#alartNum').html(sum);
	    if(sum==0){
	    	alertImg.src="images/ludeng.png";	    
	    	$("#alertImg").removeClass("shanshan");		    	
		}else{		    	
		    alertImg.src="images/reddeng.png";
		    $("#alertImg").addClass("shanshan");							
		}		
	    initCharts(toShowChartsData)
	}
	
	function initCharts(toShowChartsData){
		var item;
		for(var i in toShowChartsData){
			item = toShowChartsData[i];
			chartsModule(item.chartData, document.querySelector('#'+item.domId));
		}
		
	}
	
	function chartsModule(n,thisindex){		
	    var data = [], h = 36, m = 10,num = n/1;
		for (var j = 0; j <num; j++) {
		    data.push([Math.random() *m*j, (Math.random() * 10 > 5?-1:1)*Math.random() *h*j]);
		   //data.push([Math.random() *5, Math.random() *360]);
		}
	    var keyGuarantee_option = {
	    	polar: {
	    		radius:'100%'//圆半径控制圆大小
	    	},
	    	backgroundColor: '#fff',
		    angleAxis: {
		        type: 'category',	        
		        boundaryGap: false,
		        axisLine: {
		            show: true//是否显示圆形的边框
		        }
		    },
		    radiusAxis: {
		        type: 'category',	       
		        axisLine: {
		            show: false
		        },
		        axisLabel: {
		            rotate: 45
		        }
		    },
		    series: [{
		        name: '',
		        type: 'scatter',
		        coordinateSystem: 'polar',
		        symbolSize:4,
		        itemStyle: {
			        normal: {
			            color: "#8D99A0"		                
			        }
			    },
		        data: data
		    }]
	    };
		echarts.init(thisindex).setOption(keyGuarantee_option);
	}