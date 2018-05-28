$(function () {
	send_echo();
});

function send_echo() {
	var echo_websocket = new WebSocket("ws://" + url + "/bigscreen-schedule/websocket/bigScreenWebSocket");
	echo_websocket.onopen = function () {
		console.log('智能制造右屏websocket已连接...');
		echo_websocket.send("kpiIndexRightScreen");
	};
	//处理服务端返回消息
	echo_websocket.onmessage = function (event) {
		var datas = JSON.parse(event.data);
		console.log(event.data); //处理服务端返回消息
		if (datas.TSR_CODE == "0") {
			zhizaoRight(datas.body)
		} else if (datas.TSR_CODE == "1") {
		}
	};
	//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
	window.onbeforeunload = closeWebSocket;
	//关闭WebSocket连接
	function closeWebSocket() {
		echo_websocket.close();
	}
	//websocket断开
	echo_websocket.onclose = function (event) {
		console.log('websocket已关闭...');
	};
}

function zhizaoRight(bodyData) {
	handle_dropoutRate(bodyData.twoGVoiceRate || []);
	handle_prb(bodyData.PRBuseRate || []);
	handle_rrc(bodyData.RRCsetRate || []);
	handle_http(bodyData.HttpScanRate || []);
}


function handle_dropoutRate(attackData) {
	//2G掉话率
	var xAxisDataJson = [], seriesDataJson1 = [], seriesDataJson2 = [], seriesDataJson3 = [];
	$.each(attackData.reverse(),function(index,obj){
		xAxisDataJson.push(obj.time.substring(5,16));	
		seriesDataJson1.push(obj.twoGQingnianCenter);
		seriesDataJson2.push(obj.twoGJilingCenter);
		seriesDataJson3.push(obj.twoGBolanCenter);		
	});
	var nontradition_chart1 = echarts.init(document.getElementById('nontradition_chart1'));
	var nontradition_option = {
		grid: {top: "10%", bottom: "13%", left: "10%", right: "3%", height : '180px'},
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30, textStyle: {"color": "#fff", "fontSize": 10}},
			splitLine: {show: false},
			data: xAxisDataJson
		},
		legend: {
			icon: 'rect', itemWidth: 20, itemHeight: 10, itemGap: 13, x: "center",
			data: ['国际青年会议中心', '金陵中心', '博览中心'],
			textStyle: {color: '#fff'}
		},
		yAxis: {
			type: 'value',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {formatter: '{value}%',textStyle: {"color": "#fff", "fontSize": 10}},
			splitLine: {lineStyle: {color: "#51627D"}}
		},
		series: [{
			symbolSize:4,showAllSymbol: true,
			lineStyle: {normal: {color: '#FEC96A', width: 2}},
			itemStyle: {normal: {color: "#FEC96A"}},
			name: "国际青年会议中心", type: 'line', data: seriesDataJson1
		}, {
			symbolSize: 4, showAllSymbol: true, lineStyle: {normal: {color: '#62CEEF', width: 2}},
			itemStyle: {normal: {color: "#62CEEF"}},
			name: "金陵中心", type: 'line', data: seriesDataJson2
		}, {
			symbolSize: 4,  showAllSymbol: true,lineStyle: {normal: {color: '#FA4D41', width: 2}},
			itemStyle: {normal: {color: "#FA4D41"}},
			name: "博览中心", type: 'line', data: seriesDataJson3
		}]
	};
	
	nontradition_chart1.setOption(nontradition_option);
}

function handle_prb(iTVAttackData) {
	//PRB利用率
	var xAxisDataJson = [], seriesDataJson1 = [], seriesDataJson2 = [], seriesDataJson3 = [],seriesDataJson4 = [], seriesDataJson5 = [], seriesDataJson6 = [];
	$.each(iTVAttackData.reverse(),function(index,obj){
		xAxisDataJson.push(obj.time.substring(5,16));	
		seriesDataJson1.push(obj.PRBJiling);
		seriesDataJson3.push(obj.PRBfeiermeng);		
		seriesDataJson4.push(obj.PRBBolanCenter);
		seriesDataJson5.push(obj.PRBQingnian);
		seriesDataJson6.push(obj.PRBxinhua);		
	});
	var nontradition_chart2 = echarts.init(document.getElementById('nontradition_chart2'));
	var nontradition_option = {
		grid: {top: "10%", bottom: "13%", left: "10%", right: "3%", height : '180px'},
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30, textStyle: {"color": "#fff", "fontSize": 10}},
			splitLine: {show: false},
			data: xAxisDataJson
		},
		legend: {
			icon: 'rect', itemWidth: 10, itemHeight: 10, x: "center",
			data: ['金陵中心','费尔蒙酒店', '博览中心','青会酒店','粤海酒店'],
			textStyle: {color: '#fff'}
		},
		yAxis: {
			type: 'value',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {formatter: '{value}%',textStyle: {"color": "#fff", "fontSize": 10}},
			splitLine: {lineStyle: {color: "#51627D"}}
		},
		series: [{
			symbolSize:4, showAllSymbol: true,
			lineStyle: {normal: {color: '#FF9933', width: 2}},
			itemStyle: {normal: {color: "#FF9933"}},
			name: "金陵中心", type: 'line', data: seriesDataJson1
		},{
			symbolSize: 4, showAllSymbol: true, lineStyle: {normal: {color: '#FA4D41', width: 2}},
			itemStyle: {normal: {color: "#FA4D41"}},
			name: "费尔蒙酒店", type: 'line', data: seriesDataJson3
		},{
			symbolSize:4, showAllSymbol: true,
			lineStyle: {normal: {color: '#FFEE33', width: 2}},
			itemStyle: {normal: {color: "#FFEE33"}},
			name: "博览中心", type: 'line', data: seriesDataJson4
		}, {
			symbolSize:4, showAllSymbol: true, lineStyle: {normal: {color: '#778BE4', width: 2}},
			itemStyle: {normal: {color: "#778BE4"}},
			name: "青会酒店", type: 'line', data: seriesDataJson5
		}, {
			symbolSize: 4,  showAllSymbol: true,lineStyle: {normal: {color: '#DD7B87', width: 2}},
			itemStyle: {normal: {color: "#DD7B87"}},
			name: "粤海酒店", type: 'line', data: seriesDataJson6
		}]
	};
	nontradition_chart2.setOption(nontradition_option);
}

function handle_rrc(publcCusbarriers) {
	//RRC建立成功率/重建比
	var xAxisDataJson = [], seriesDataJson1 = [], seriesDataJson2 = [], seriesDataJson3 = [],seriesDataJson4 = [], seriesDataJson5 = [], seriesDataJson6 = [],
	seriesDataJson7 = [], seriesDataJson8 = [], seriesDataJson9 = [],seriesDataJson10 = [];
	$.each(publcCusbarriers.reverse(),function(index,obj){
		xAxisDataJson.push(obj.time.substring(5,16));	
		seriesDataJson1.push(obj.RRCresetBolanCenter);seriesDataJson2.push(obj.RRCresetFeiermeng);
		seriesDataJson3.push(obj.RRCresetQingnian);
		seriesDataJson4.push(obj.RRCresetXinhua);seriesDataJson5.push(obj.RRCresetJiling);	
		
		seriesDataJson6.push(obj.RRCsetBolanCenter);seriesDataJson7.push(obj.RRCsetFeiermeng);
		seriesDataJson8.push(obj.RRCsetQingnian);
		seriesDataJson9.push(obj.RRCsetXinhua);seriesDataJson10.push(obj.RRCsetJiling);
	});
	var jswapAttacks_chart01 = echarts.init(document.getElementById('jswapAttacks_chart01'));
	var customerComplaints_option01 = {	
		grid:[{left: 50,right: 50,height: '27%'}, {left: 50,right: 50,top: '58%',height: '30%'}],
    	legend: {icon:'rect',itemWidth:10,itemHeight:10,left:"center",data: [ '博览中心','费尔蒙酒店','青会酒店', '粤海酒店','金陵中心'],	           
		    textStyle:{color:'#fff'}	        		       	
	    },
	    tooltip: {trigger: 'axis', axisPointer: {animation: false}},
		axisPointer: {link: {xAxisIndex: 'all'}},
	    xAxis:[{
	        type: 'category',                 
	        axisLine: {lineStyle: {color: '#fff'},onZero: true},
	        axisLabel: {textStyle: {"color": "#fff", "fontSize": 10}},
	        data: xAxisDataJson
	    },{
	    	gridIndex: 1,type : 'category',          
            axisLine: {lineStyle: {color: '#fff'},onZero: true},
            data: xAxisDataJson,
            axisLabel: {show:false}
	    }],
	    yAxis: [{
			type: 'value',name:'建立成功率(%)',min:"60.00",max:"100.00",		
            axisLine: {lineStyle: {color: '#fff'}},
			axisLabel: {formatter: '{value}%',textStyle: {color: "#fff", fontSize: 10}},
			splitLine: {lineStyle: {color: "#51627D"}}
		},{
			gridIndex: 1,name:'重建比(%)',type: 'value', inverse: true,
			axisLine: {lineStyle: {color: '#fff'}},
			axisLabel: {formatter: '{value}%',textStyle: {color: "#fff", "fontSize": 10}},
			splitLine: {lineStyle: {color: "#51627D"}}
		}],
	    series:[
	    {
			symbolSize:4,name:'博览中心',smooth:true,		
			lineStyle: {normal: {color: '#FFEE33', width: 2}},
			itemStyle: {normal: {color: "#FFEE33"}},showAllSymbol: true,
			type: 'line', data: seriesDataJson6
		}, {
			symbolSize:4,name:'费尔蒙酒店',smooth:true,
			lineStyle: {normal: {color: '#FA4D41', width: 2}},
			itemStyle: {normal: {color: "#FA4D41"}},showAllSymbol: true,
			type: 'line', data: seriesDataJson7
		}, {
			symbolSize:4,name:'青会酒店',smooth:true,lineStyle: {normal: {color: '#778BE4', width: 2}},showAllSymbol: true,
			itemStyle: {normal: {color: "#778BE4"}},type: 'line', data: seriesDataJson8
		},{
			symbolSize:4,smooth:true,lineStyle: {normal: {color: '#DD7B87', width: 2}},showAllSymbol: true,
			itemStyle: {normal: {color: "#DD7B87"}},
			name: "粤海酒店", type: 'line', data: seriesDataJson9
		},  {
			symbolSize: 4,smooth:true,lineStyle: {normal: {color: '#FF9933', width: 2}},showAllSymbol: true,
			itemStyle: {normal: {color: "#FF9933"}},
			name: "金陵中心", type: 'line', data: seriesDataJson10
		},{
			symbolSize:4,name:'博览中心重建比',smooth:true,showAllSymbol: true,
             xAxisIndex: 1,yAxisIndex: 1,lineStyle: {normal: {color: '#FFEE33', width: 2}},
			itemStyle: {normal: {color: "#FFEE33"}},type: 'line', data: seriesDataJson1
		},{			
			symbolSize:4,name:'费尔蒙酒店重建比',smooth:true,xAxisIndex: 1,
            yAxisIndex: 1,
			lineStyle: {normal: {color: '#FA4D41', width: 2}},showAllSymbol: true,
			itemStyle: {normal: {color: "#FA4D41"}},type: 'line', data: seriesDataJson2
		},{	
			symbolSize:4,name:'青会酒店重建比',smooth:true, xAxisIndex: 1,
            yAxisIndex: 1,showAllSymbol: true,
			lineStyle: {normal: {color: '#778BE4', width: 2}},
			itemStyle: {normal: {color: "#778BE4"}},type: 'line', data: seriesDataJson3
		},  {
			symbolSize:4,name:'粤海酒店重建比',smooth:true,lineStyle: {normal: {color: '#DD7B87', width: 2}},
			showAllSymbol: true, xAxisIndex: 1,
            yAxisIndex: 1,itemStyle: {normal: {color: "#DD7B87"}},type: 'line', data: seriesDataJson4
		},{
			symbolSize:4,name:'金陵中心重建比',smooth:true,lineStyle: {normal: {color: '#FF9933', width: 2}},
			showAllSymbol: true, xAxisIndex: 1,
            yAxisIndex: 1,itemStyle: {normal: {color: "#FF9933"}},type: 'line', data: seriesDataJson5
		}]
	};
	jswapAttacks_chart01.setOption(customerComplaints_option01);
}

function handle_http(govCusbarriers) {
	//HTTP浏览优良率
	var xAxisDataJson = [], seriesDataJson1 = [];
	$.each(govCusbarriers.reverse(), function (index, obj) {
		xAxisDataJson.push(obj.time.substring(5,16));		
		seriesDataJson1.push(obj.value);
	});
	var governmentAttacks_chart2 = echarts.init(document.getElementById('governmentAttacks_chart2'));
	var customerComplaints_option01 = {
		grid: {top: "8%", bottom: "20%", left: "10%", right: "3%"},
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate:20,textStyle: {"color": "#fff", "fontSize":10}},
			splitLine: {show: false},
			data: xAxisDataJson
		},		
		yAxis: {
			type: 'value',minInterval : 1,
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {formatter: '{value}%',textStyle: {"color": "#fff", "fontSize":10}},
			splitLine: {lineStyle: {color: "#51627D"}}
		},
		series: [{
			symbolSize:4, showAllSymbol: true,
			lineStyle: {normal: {color: '#FEC96A', width: 2}},
			itemStyle: {normal: {color: "#FEC96A"}},
			name: "优良率", type: 'line', data: seriesDataJson1
		}]
	};
	governmentAttacks_chart2.setOption(customerComplaints_option01);
}
