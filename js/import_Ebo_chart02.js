$(function () {
	send_echo();
});

function send_echo() {
	var echo_websocket = new WebSocket("ws://" + url + "/bigscreen-schedule/websocket/bigScreenWebSocket");
	echo_websocket.onopen = function () {
		console.log('国家公祭日右屏websocket已连接...');
		echo_websocket.send("memorialDayKpiIndexScreen");
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
	handle_prb(bodyData.MemorialPRBuseRate || []);
	handle_rrcSet(bodyData.MemorialRRCsetRate || []);
	handle_rrcRes(bodyData.MemorialRRCsetRate || []);
	handle_http(bodyData.HttpScanRate || []);
}

function handle_prb(iTVAttackData) {
	//PRB利用率
	var xAxisDataJson = [], seriesDataJson1 = [];
	$.each(iTVAttackData.reverse(),function(index,obj){
		xAxisDataJson.push(obj.time.substring(5,16));	
		seriesDataJson1.push(obj.value);
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
			data: ['大屠杀遇难同胞纪念馆'],
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
			lineStyle: {normal: {color: '#62CEEF', width: 2}},
			itemStyle: {normal: {color: "#62CEEF"}},
			name: "大屠杀遇难同胞纪念馆", type: 'line', data: seriesDataJson1
		}]
	};
	nontradition_chart2.setOption(nontradition_option);
}

function handle_rrcSet(publcCusbarriers) {
	//RRC建立成功率
	var xAxisDataJson = [], seriesDataJson1 = [];
	$.each(publcCusbarriers.reverse(),function(index,obj){
		xAxisDataJson.push(obj.time.substring(5,16));	
		seriesDataJson1.push(obj.RRCsetJinianguan);
	});
	var jswapAttacks_chart01 = echarts.init(document.getElementById('jswapAttacks_chart01'));
	var customerComplaints_option01 = {	
		grid: {top: "15%", bottom: "13%", left: "10%", right: "3%", height : '180px'},
    	legend: {icon:'rect',itemWidth:10,itemHeight:10,left:"center",data: [ '大屠杀遇难同胞纪念馆'],	           
		    textStyle:{color:'#fff'}	        		       	
	    },
	    tooltip: {trigger: 'axis',axisPointer: { type: 'shadow'}},
	    xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30, textStyle: {"color": "#fff", "fontSize": 10}},
			splitLine: {show: false},
			data: xAxisDataJson
		},
	    yAxis: [{
			type: 'value',name:'建立成功率(%)',min:"85.00",max:"100.00",		
            axisLine: {lineStyle: {color: '#fff'}},
			axisLabel: {formatter: '{value}%',textStyle: {color: "#fff", fontSize: 10}},
			splitLine: {lineStyle: {color: "#51627D"}}
		}],
	    series:[
	    {
			symbolSize:4,name:'大屠杀遇难同胞纪念馆',	
			lineStyle: {normal: {color: '#FF9933', width: 2}},
			itemStyle: {normal: {color: "#FF9933"}},showAllSymbol: true,
			type: 'line', data: seriesDataJson1
		}]
	};
	jswapAttacks_chart01.setOption(customerComplaints_option01);
}


function handle_rrcRes(publcCusbarriers) {
	//RRC重建比
	var xAxisDataJson = [], seriesDataJson1 = [];
	$.each(publcCusbarriers.reverse(),function(index,obj){
		xAxisDataJson.push(obj.time.substring(5,16));	
		seriesDataJson1.push(obj.RRCresetJinianguan);
	});
	var jswapAttacks_chart02 = echarts.init(document.getElementById('jswapAttacks_chart02'));
	var customerComplaints_option02 = {	
		grid: {top: "15%", bottom: "13%", left: "10%", right: "3%", height : '180px'},
    	legend: {icon:'rect',itemWidth:10,itemHeight:10,left:"center",data: [ '大屠杀遇难同胞纪念馆'],	           
		    textStyle:{color:'#fff'}	        		       	
	    },
	    tooltip: {trigger: 'axis',axisPointer: { type: 'shadow'}},
	   xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30, textStyle: {"color": "#fff", "fontSize": 10}},
			splitLine: {show: false},
			data: xAxisDataJson
		},
	    yAxis: [{
			type: 'value',name:'重建比(%)',
            axisLine: {lineStyle: {color: '#fff'}},
			axisLabel: {formatter: '{value}%',textStyle: {color: "#fff", fontSize: 10}},
			splitLine: {lineStyle: {color: "#51627D"}}
		}],
	    series:[
	    {
			symbolSize:4,name:'大屠杀遇难同胞纪念馆',
			lineStyle: {normal: {color: '#62CEEF', width: 2}},
			itemStyle: {normal: {color: "#62CEEF"}},showAllSymbol: true,
			type: 'line', data: seriesDataJson1
		}]
	};
	jswapAttacks_chart02.setOption(customerComplaints_option02);
}


function handle_http(govCusbarriers) {
	//HTTP浏览优良率
	var xAxisDataJson = [], seriesDataJson1 = [];
	$.each(govCusbarriers.reverse(), function (index, obj) {
		xAxisDataJson.push(obj.time.substring(5,16));		
		seriesDataJson1.push(obj.value);
	});
	var governmentAttacks_chart1 = echarts.init(document.getElementById('governmentAttacks_chart1'));
	var customerComplaints_option01 = {
		grid: {top: "8%", bottom: "20%", left: "10%", right: "3%"},
		legend: {
			icon: 'rect', itemWidth: 10, itemHeight: 10, x: "center",
			data: ['大屠杀遇难同胞纪念馆'],
			textStyle: {color: '#fff'}
		},
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
			name: "大屠杀遇难同胞纪念馆", type: 'line', data: seriesDataJson1
		}]
	};
	governmentAttacks_chart1.setOption(customerComplaints_option01);
}
