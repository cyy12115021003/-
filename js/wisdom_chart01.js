$(function(){
	echarts.registerMap('jiangsuJson', jiangsuJson);
	send_echo();
});
function send_echo() {       
	var echo_websocket = new WebSocket("ws://"+url+"/bigscreen-schedule/websocket/bigScreenWebSocket");   
  	echo_websocket.onopen = function () {
        console.log('websocket已连接...');
  	    echo_websocket.send("mowMiddleScreen");
	};
     //处理服务端返回消息
	echo_websocket.onmessage = function (event) {
   		var datas = JSON.parse(event.data);
  	    console.log(event.data); //处理服务端返回消息
  	    if (datas.TSR_CODE == "0"){  	        	 	        	
  	        wisdomMiddle(datas)	        	
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
function wisdomMiddle(data){
	var HN = data.body.railDrop.HN;//沪宁
	var HQ = data.body.railDrop.HQ;//沪启
	var JH = data.body.railDrop.JH;//京沪
	var NA = data.body.railDrop.NA;//宁安
	var NH = data.body.railDrop.NH;//宁杭
    var wisdom_chart_Map = echarts.init(document.getElementById('wisdom_chart_Map'));
    var geoCoordMap = {
    	//京沪
    	'徐州JH': [117.2,34.26],//京沪
    	"南京JH": [118.65,31.99],//京沪
    	"镇江JH":[119.55,32],//京沪
    	'常州JH':[119.95,31.76],//京沪
    	'无锡JH':[120.29,31.59],//京沪
    	'苏州JH': [120.62,31.32],//京沪
    	//沪宁
    	"南京HN": [118.83,32.10],//沪宁
    	'镇江HN':[119.44,32.18],
    	'常州HN':[119.89,31.92],//沪宁
    	'无锡HN':[120.39,31.66],//沪宁
    	'苏州HN':[120.78,31.34],//沪宁
    	 //宁安
    	"南京NA": [118.68,31.85],//宁安
    	'安庆NA': [118.01,31.50],//宁安    	    	
    	//宁杭
    	"南京NH": [118.83,31.81],//宁杭
    	"镇江NH":[119.20,31.87],//宁杭
    	"常州NH":[119.47,31.46],//宁杭
    	"无锡NH":[119.82,31.36],//宁杭
    	'杭州NH': [119.89,30.55],//宁杭   	   	
    	//沪启
    	"南京HQ": [118.90,32.30],//沪启
    	'扬州HQ':[119.42,32.39],
    	'泰州HQ':[119.98,32.49],
    	'南通HQ': [120.95,32.05]    
	};
	// 京沪
	var aa = [
	    [{name:'徐州JH'},{name:'徐州JH',value:JH.XZ.value,types:JH.XZ.type}]
	];
	var XZJH = [
	    [{name:'徐州JH'},{name:'南京JH',value:JH.NJ.value,types:JH.NJ.type}]
	];
	var NJJH = [
	    [{name:'南京JH'},{name:'镇江JH',value:JH.ZJ.value,types:JH.ZJ.type}]
	];
	var ZJJH = [
	    [{name:'镇江JH'},{name:'常州JH',value:JH.ZJ.value,types:JH.ZJ.type}]
	];
	var CZJH = [
	    [{name:'常州JH'},{name:'无锡JH',value:JH.WX.value,types:JH.WX.type}]
	];
	var WXJH = [
	    [{name:'无锡JH'},{name:'苏州JH',value:JH.SZ.value,types:JH.SZ.type}]
	];	
	//沪宁
	var bb = [
	    [{name:'南京HN'},{name:'南京HN',value:HN.NJ.value,types:HN.NJ.type}]  
	];
	var NJHN = [
	    [{name:'南京HN'},{name:'镇江HN',value:HN.ZJ.value,types:HN.ZJ.type}]  
	];
	var ZJHN = [
	    [{name:'镇江HN'},{name:'常州HN',value:HN.CZ.value,types:HN.CZ.type}]  
	];
	var CZHN = [
	    [{name:'常州HN'},{name:'无锡HN',value:HN.WX.value,types:HN.WX.type}]  
	];
	var WXHN = [
	    [{name:'无锡HN'},{name:'苏州HN',value:HN.SZ.value,types:HN.SZ.type}]  
	];
	// 宁安高铁	
	var AQNA = [
	    [{name:'安庆NA'},{name:'南京NA',value:NA.NJ.value,types:NA.NJ.type}]  
	];
	//宁杭高铁
	var NJNH = [	  
	    [{name:'镇江NH'},{name:'南京NH',value:NH.NJ.value,types:NH.NJ.type}]	  
	];
	var ZJNH = [	  
	    [{name:'常州NH'},{name:'镇江NH',value:NH.ZJ.value,types:NH.ZJ.type}]	  
	];
	var CZNH = [	  
	    [{name:'无锡NH'},{name:'常州NH',value:NH.CZ.value,types:NH.CZ.type}]	  
	];
	var WXNH = [	  
	    [{name:'杭州NH'},{name:'无锡NH',value:NH.WX.value,types:NH.WX.type}]	  
	];
	//沪启高铁
	var cc = [	   
	    [{name:'南京HQ'},{name:'南京HQ',value:HQ.NJ.value,types:HQ.NJ.type}]
	];
	var NJHQ = [	   
	    [{name:'南京HQ'},{name:'扬州HQ',value:HQ.YZ.value,types:HQ.YZ.type}]
	];
	var YZHQ = [	   
	    [{name:'扬州HQ'},{name:'泰州HQ',value:HQ.TZ.value,types:HQ.TZ.type}]
	];
	var TZHQ = [	   
	    [{name:'泰州HQ'},{name:'南通HQ',value:HQ.NT.value,types:HQ.NT.type}]
	];
var planePath = 'path://M694.098884 627.138756 694.098884 377.263158c0-37.562998-31.030303-68.593301-68.593301-68.593301l-228.644338 0c-37.562998 0-68.593301 31.030303-68.593301 68.593301l0 249.875598c0 34.296651 26.130781 63.69378 58.794258 68.593301l-60.427432 75.125997L391.961722 770.858054l65.326954-73.492823L571.610845 697.365231l60.427432 73.492823 62.060606 0-55.527911-75.125997C669.601276 689.199362 694.098884 661.435407 694.098884 627.138756zM400.127592 658.169059c-16.331738 0-31.030303-13.065391-31.030303-31.030303 0-16.331738 13.065391-31.030303 31.030303-31.030303 16.331738 0 31.030303 13.065391 31.030303 31.030303C431.157895 643.470494 418.092504 658.169059 400.127592 658.169059zM618.972887 658.169059c-16.331738 0-31.030303-13.065391-31.030303-31.030303 0-16.331738 13.065391-31.030303 31.030303-31.030303 16.331738 0 31.030303 13.065391 31.030303 31.030303C650.00319 643.470494 636.937799 658.169059 618.972887 658.169059zM664.701754 493.218501c0 19.598086-14.698565 34.296651-34.296651 34.296651L393.594896 527.515152c-19.598086 0-34.296651-14.698565-34.296651-34.296651l0-75.125997c0-19.598086 14.698565-34.296651 34.296651-34.296651l235.177033 0c19.598086 0 34.296651 14.698565 34.296651 34.296651L663.068581 493.218501z" p-id="2471"></path><path d="M470.354067 292.338118l83.291866 0c13.065391 0 24.497608-11.432217 24.497608-24.497608 0-13.065391-11.432217-24.497608-24.497608-24.497608l-83.291866 0c-13.065391 0-24.497608 11.432217-24.497608 24.497608C445.856459 280.905901 457.288676 292.338118 470.354067 292.338118z';
var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = geoCoordMap[dataItem[0].name];
        var toCoord = geoCoordMap[dataItem[1].name];             
        if (fromCoord && toCoord) {
            res.push({
                fromName: dataItem[0].name,
                toName: dataItem[1].name,
                coords: [fromCoord, toCoord]               
            });
        }
    }
    return res;
};

var series = [];
[['徐州JH',aa],['徐州JH',XZJH],['南京JH', NJJH],['镇江JH',ZJJH],['常州JH',CZJH],['无锡JH', WXJH],
['南京HN', bb],['南京HN', NJHN],['镇江HN', ZJHN],['常州HN',CZHN],['无锡HN',WXHN],
['安庆NA',AQNA],
['镇江NH',NJNH],['常州NH',ZJNH],['无锡NH',CZNH],['杭州NH',WXNH ],
['南京HQ',cc],['南京HQ',NJHQ],['扬州HQ',YZHQ],['泰州HQ',TZHQ]].forEach(function (item, i) {				
		series.push(
	    {	            
	        type: 'lines',
	        zlevel: 2,	       	        
	        effect: {
	            show: true,
	            period: 6,
	            trailLength: 0,
	            symbol: 'arrow',
	            symbolSize:6,	//箭头大小                  
	        },	        
	        lineStyle: {
	            normal: {
	                color:function(obj) {	                	
	                     var color = "";		                    
	                     switch (obj.data.toName) {
	                        case "南京HN":
	                             color = "#FF9B28";
	                             break;
	                        case "镇江HN":
	                             color = "#FF9B28";
	                             break;
	                        case "常州HN":
	                             color = "#FF9B28";
	                             break; 
	                        case "无锡HN":
	                             color = "#FF9B28";
	                             break;
	                        case "苏州HN":
	                             color = "#FF9B28";
	                             break; 
	                        case "徐州JH":
	                             color = "#28EFFF";
	                             break;
	                        case "南京JH":
	                             color = "#28EFFF";
	                             break;
	                        case "镇江JH":
	                             color = "#28EFFF";
	                             break;
	                        case "常州JH":
	                             color = "#28EFFF";
	                             break;
	                        case "无锡JH":
	                             color = "#28EFFF";
	                             break;
	                        case "苏州JH":
	                             color = "#28EFFF";
	                             break;	
	                        case "南京NH":
	                             color = "#FA4D41";
	                             break;
	                        case "镇江NH":
	                             color = "#FA4D41";
	                             break;
	                        case "常州NH":
	                             color = "#FA4D41";
	                             break;
	                        case "无锡NH":
	                             color = "#FA4D41";
	                             break;	                                                
	                         case "南京NA":
	                             color = "#F8E71C";
	                             break;
	                        case "南京HQ":
	                             color = "#42FF00";
	                             break;	
	                        case "南通HQ":
	                             color = "#42FF00";
	                             break;	
	                        case "扬州HQ":
	                             color = "#42FF00";
	                             break;	 
	                        case "泰州HQ":
	                             color = "#42FF00";
	                             break;	 
	                     }
	                     return color;
	                },	               
	                width:2,
	                opacity:1
	            }
	        },
	        data: convertData(item[1])
	    },
	    {	      
	        type: 'effectScatter',
	        coordinateSystem: 'geo',
	        zlevel: 2,
	        rippleEffect: {
	            brushType: 'fill'
	        },	        
	        symbolSize:function(obj){
	        	var symbolSize = "";	        	
	        	if(obj[2]<=0.50){
	        		symbolSize=7;
	        	}else{
	        		symbolSize=15;
	        	}
	        	return symbolSize;
	        },
	        itemStyle: {
	            normal: {
	                areaColor:'#fff',
	                color:function(obj) {	                	
	                     var color = "";	                    
	                     switch (obj.data.toName) {
	                        case "南京HN":
	                             color = "#FF9B28";
	                             break;
	                        case "镇江HN":
	                             color = "#FF9B28";
	                             break;
	                        case "常州HN":
	                             color = "#FF9B28";
	                             break; 
	                        case "无锡HN":
	                             color = "#FF9B28";
	                             break;
	                        case "苏州HN":
	                             color = "#FF9B28";
	                             break; 
	                        case "徐州JH":
	                             color = "#28EFFF";
	                             break;
	                        case "南京JH":
	                             color = "#28EFFF";
	                             break;
	                        case "镇江JH":
	                             color = "#28EFFF";
	                             break;
	                        case "常州JH":
	                             color = "#28EFFF";
	                             break;
	                        case "无锡JH":
	                             color = "#28EFFF";
	                             break;
	                        case "苏州JH":
	                             color = "#28EFFF";
	                             break;	
	                        case "南京NH":
	                             color = "#FA4D41";
	                             break;
	                        case "镇江NH":
	                             color = "#FA4D41";
	                             break;
	                        case "常州NH":
	                             color = "#FA4D41";
	                             break;
	                        case "无锡NH":
	                             color = "#FA4D41";
	                             break;	                                                
	                         case "南京NA":
	                             color = "#F8E71C";
	                             break;
	                        case "南京HQ":
	                             color = "#42FF00";
	                             break;	
	                        case "南通HQ":
	                             color = "#42FF00";
	                             break;	
	                        case "扬州HQ":
	                             color = "#42FF00";
	                             break;	 
	                        case "泰州HQ":
	                             color = "#42FF00";
	                             break;	 
	                     }
	                     return color;
	                }
	            }
	        },
	        data: item[1].map(function (dataItem) {
	            return {
	                name: dataItem[1].name,
	                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value],[dataItem[1].types]),
	                types: geoCoordMap[dataItem[1].name].concat([dataItem[1].types]),
	            };
	        })					  		
	});
});

var wisdomtMap_option = {  
    tooltip : {
        trigger: 'item',
        enterable:true,
        formatter: function(params) {        	
            var normal = '';           
            normal = '<div class="mapTrigger">沿线掉话情况：' + params.data.value[2] +'%</div>';
            return normal;       
        }
    },
    geo: {
        map: 'jiangsuJson',      
        zoom:1.15,
        top:"9%",
        label: {
            emphasis: {
                show: false
            }
        },
        roam: false,
        itemStyle: {
            normal: {
                areaColor: '#05183E',
                borderColor: '#1690D4',
                borderWidth:2
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
    series: series
};				  
    wisdom_chart_Map.setOption(wisdomtMap_option);
    
    //感知优良率
    var xRailName = [];
    var yAixBest = [];
    var yAixWorse = [];
    var allDistance = [];
    var perceRate = data.body.perceRate;
    $.each(perceRate,function(index,obj){
		   xRailName.push(obj.name); 
		   yAixBest.push(obj.best_rate);
		   yAixWorse.push(obj.worse_rate);
		   allDistance.push(obj.AVG_rate);
	}); 
    
    var wisdom_chart01 = echarts.init(document.getElementById('wisdom_chart01'));
    var wisdom_option01 = {				    	
		tooltip : {
			trigger: 'axis'					        
   		},
		
	    legend: {  
	    	x:"center",
	        data: ['全程','最优','最差'],     	           
		    textStyle:{
		    	color:'#fff'
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
	        	"interval":0,
	        	textStyle: {
	                "color": "#fff",
	                "fontSize":20           
	           }
	        },
	        splitLine: {
	            show: false,
	        },
	        nameTextStyle: {
	            color: '#fff',
	            fontStyle: 'normal',
	            fontWeight: 'normal',          
	            fontSize: 18,
	        },
	        data:xRailName
	        //["沪宁高铁", "京沪高铁", "宁杭高铁", "宁安高铁","沪启高铁"]
		},
	   
	    yAxis: {
	        type: 'value',
	        axisLine: {
	            lineStyle: {
	                color: '#51627D'
	            }
	        },
	        axisLabel : {
	            formatter: '{value}%',
	            textStyle: {
	                "color": "#fff",
	                "fontSize": 16         
	            }
	        },
	        splitLine:{
	            lineStyle:{
	                color:"#51627D"
	            }
        	}
	        
		},
		   
	    series: [
	    	{		    	
		        itemStyle: {
		            normal: {
		                color: "#FFBA14"		                
		            }
		        },
		        name: "全程",
		        type: 'bar',
		        barWidth:16,
		        data:allDistance
		        //[{value:'12'},{value:'15'},{value:'17'},{value:'18'},{value:'14'}]
	       },
		    {		    	
		        itemStyle: {
		            normal: {
		                color: "#4DBFFF",
		                label: {
	                        show: true,
	                        position: 'top',
	                        textStyle: {
	                            fontSize:16,
	                            color:"#fff"
	                        },
	                        formatter:function(params) {					        	
					            var normal = '';  
					            switch (params.data.name) {
			                        case "苏州":
			                             normal = "苏";
			                             break;
			                        case "镇江":
			                             normal = "镇";
			                             break; 
			                        case "常州":
			                             normal = "常";
			                             break;			                       							                        
			                        case "无锡":
			                             normal = "	锡";
			                             break;							                        
			                         case "徐州":
			                             normal = "徐";
			                             break;
			                        case "南京":
			                             normal = "宁";
			                             break;
			                        case "扬州":
			                             normal = "扬";
			                             break;
			                        case "泰州":
			                             normal = "泰";
			                             break;
			                        case "南通":
			                             normal = "通";
			                             break;
	                       
	                    		}									                  	
					            return normal;                   
	        				}
                    	}
		            }
		        },
		        name: "最优",
		        barWidth:16,
		        type: 'bar',
		        data:yAixBest
		       // [{name:'宁',value:'2'},{name:'宁',value:'5'},{name:'宁',value:'7'},{name:'宁',value:'8'},{name:'宁',value:'4'}]
		    },
		    {		    	
		        itemStyle: {
		            normal: {
		                color: "#F8E71C",
		                label: {
	                        show: true,
	                        position: 'top',
	                        textStyle: {
	                            fontSize:16,
	                            color:"#fff"
	                        },
	                        formatter:function(params) {					        	
					            var normal = '';  
					            switch (params.data.name) {
			                        case "苏州":
			                             normal = "苏";
			                             break;
			                        case "镇江":
			                             normal = "镇";
			                             break; 
			                        case "常州":
			                             normal = "常";
			                             break;			                       							                        
			                        case "无锡":
			                             normal = "	锡";
			                             break;							                        
			                         case "徐州":
			                             normal = "徐";
			                             break;
			                        case "南京":
			                             normal = "宁";
			                             break;
			                        case "扬州":
			                             normal = "扬";
			                             break;
			                        case "泰州":
			                             normal = "泰";
			                             break;
			                        case "南通":
			                             normal = "通";
			                             break;
	                       
	                    		}									                  	
					            return normal;           
	        				}
                    	}
		            }
		        },
		        name: "最差",
		        type: 'bar',
		        barWidth:16,
		        data:yAixWorse
		        //[{name:'宁',value:'10'},{name:'苏',value:'8'},{name:'锡',value:'7'},{name:'扬',value:'8'},{name:'宁',value:'4'}]
		    }]
	};
	wisdom_chart01.setOption(wisdom_option01);
    //全省高铁应用排名
    var xAixRail = [];
    var yAixUserRail = [];//用户量
    var yAixFlowRail = [];//流量
    var railAPPrank = data.body.railAPPrank;
    $.each(railAPPrank,function(index,obj){
		xAixRail.push(obj.name); 
		yAixUserRail.push(obj.user);
		yAixFlowRail.push(obj.flow);
	}); 
    var wisdom_chart02 = echarts.init(document.getElementById('wisdom_chart02'));
    var wisdom_option02 = {
    	tooltip: {
            trigger: 'axis'
        },
        grid:{
   			left:"13%"  			
   		},
        legend: {
        	left:"center",	
            data: ['用户量', '流量'],
            textStyle:{
		    	color:'#fff'
		    }	
        }, 
        tooltip: {
	        trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
	    },        
        xAxis: [{
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
	                "fontSize":20             
	           }
	        },
	        splitLine: {
	            show: false,
	        },	        
            data:xAixRail
            //['网易火车票', '高铁管家', '携程旅行','去哪旅行','12306']
        }],
        yAxis: [
        {
        	type:'value',
        	name: '用户量',
        	position:'left',        	
            axisLine: {
	            lineStyle: {
	                color: '#fff'
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
	                "fontSize": 16          
	            }
	        }
	    },
        {
        	type:'value',
        	name: '流量',
        	position:'right',        	
            axisLine: {
	            lineStyle: {
	                color: '#fff'
	            }
	     	},
	        axisLabel : {
	            formatter: '{value}',
	            textStyle: {
	                "color": "#fff",
	                "fontSize":16          
	            }
	        }
	        
        }],
        series: [{
            name: '用户量',
            type: 'bar',
            barWidth:15,
            yAxis: 1, 
            itemStyle: {
                normal: {
                    color: '#FFCA6A',                   
                }
            },
            data:yAixUserRail
            //[11111,11113,11114,11116,11119]
        }, {
            name: '流量',
            type: 'bar',
            barWidth:15,
            yAxisIndex:1,
            itemStyle: {
                normal: {
                    color: '#4DBFFF',                  
                }
            },
            data:yAixFlowRail
            //[11114, 11115, 11116,11117,11119,]
        }]
    };
    wisdom_chart02.setOption(wisdom_option02);
}
