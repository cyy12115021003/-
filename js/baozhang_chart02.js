$(function () {
	send_echo();
});

function send_echo() {
	var echo_websocket = new WebSocket("ws://" + url + "/bigscreen-schedule/websocket/bigScreenWebSocket");
	echo_websocket.onopen = function () {
		console.log('websocket已连接...');
		echo_websocket.send("nineteenGRightScreen");
	};
	//处理服务端返回消息
	echo_websocket.onmessage = function (event) {
		var datas = JSON.parse(event.data);
		console.log("通信保障右屏"+event.data); //处理服务端返回消息
		if (datas.TSR_CODE == "0") {
			baozhangRight(datas)
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
		console.log('通信保障右屏websocket已关闭...');
	};
}

function baozhangRight(data) {
	//固网IMS/话务量
	var bodyData =  data.body, xAxisJson = [], itvJson = [], IMSandIVPN = bodyData.IMSandIVPN.reverse();
	$.each(IMSandIVPN, function (index, obj) {
		xAxisJson.push(obj.time.substring(11, 16));
		itvJson.push(obj.value);
	});
	var baozhang_chart03 = echarts.init(document.getElementById('baozhang_chart03'));
	var baozhang_option03 = {
		tooltip: {trigger: 'axis'},
		grid: {left: "17%"},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {interval: 0, rotate: 45, margin: 5, textStyle: {"color": "#fff", "fontSize":20}},
			splitLine: {show: false},
			data: xAxisJson
		},
		yAxis: {
			type: 'value',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {formatter: '{value}', textStyle: {"color": "#fff", "fontSize":20}},
			splitLine: {lineStyle: {color: "#51627D"}}
		},
		series: [{
			symbolSize: 6,
			lineStyle: {normal: {color: '#62CEEF', width: 2}},
			itemStyle: {normal: {color: "#62CEEF"}},
			name: "话务量", type: 'line', data: itvJson
		}]
	};
	baozhang_chart03.setOption(baozhang_option03);
	//寻呼成功率/接通成功率
	var xAxisDataJson = [], seriesDataJson1 = [], seriesDataJson2 = [], pagingAndConnectSuccRate = bodyData.pagingAndConnectSuccRate;
	$.each(pagingAndConnectSuccRate, function (index, obj) {
		xAxisDataJson.push(obj.name);
		seriesDataJson1.push(obj.paging); //寻呼成功率
		seriesDataJson2.push(obj.connect); //接通成功率
	});
	var baozhang_chart04 = echarts.init(document.getElementById('baozhang_chart04'));
	var baozhang_option04 = {
		grid: {top: "10%", bottom: "13%", left: "10%", right: "3%"},
		tooltip: {trigger: 'axis'},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {"interval": 0, textStyle: {"color": "#fff", "fontSize":20}},
			splitLine: {show: false},
			data: xAxisDataJson
		},
		legend: {
			icon: 'rect', itemWidth: 20, itemHeight: 10, itemGap: 13, x: "right",
			data: ['寻呼成功率', '接通成功率'], textStyle: {color: '#fff'}
		},
		yAxis: {
			type: 'value', min: "50.00", max: "100.00",
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {
				formatter: '{value}%',
				textStyle: {"color": "#fff", "fontSize":20}
			},
			splitLine: {lineStyle: {color: "#51627D"}}
		},
		series: [{
			symbolSize: 6, lineStyle: {normal: {color: '#FEC96A', width: 2}},
			itemStyle: {normal: {color: "#FEC96A"}},
			name: "寻呼成功率", type: 'line', data: seriesDataJson1
		}, {
			symbolSize: 6, lineStyle: {normal: {color: '#62CEEF', width: 2}}, itemStyle: {normal: {color: "#62CEEF"}},
			name: "接通成功率", type: 'line', data: seriesDataJson2
		}]
	};
	baozhang_chart04.setOption(baozhang_option04);
	
	handle_gzkhsgqk(bodyData.publcCusbarriers || []);
	handle_zqfw(bodyData.govCusbarriers || []);
}

function handle_gzkhsgqk(publcCusbarriers) {
	//公众客户申告情况
	var xAxisDataJson = [], seriesDataJson1 = [], seriesDataJson2 = [], seriesDataJson3 = [];
	$.each(publcCusbarriers.reverse(), function (index, obj) {
		xAxisDataJson.push(obj.time.substring(5, 16));
		var values = obj.value;
		seriesDataJson1.push(values.broadBCustomer);
		seriesDataJson2.push(values.itvCustomer);
		seriesDataJson3.push(values.cdmCustomer);
	});
	var customerComplaints_chart01 = echarts.init(document.getElementById('customerComplaints_chart01'));
	var customerComplaints_option01 = {
		grid: {top: "10%", bottom: "8%", left: "10%", right: "3%", height : '250px'},
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30, textStyle: {"color": "#fff", "fontSize": 15}},
			splitLine: {show: false},
			data: xAxisDataJson
		},
		legend: {
			icon: 'rect', itemWidth: 20, itemHeight: 10, itemGap: 13, x: "right",
			data: ['宽带客户申告', 'ITV客户申告', '移动网客户申告'],
			textStyle: {color: '#fff'}
		},
		yAxis: {
			type: 'value',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {textStyle: {"color": "#fff", "fontSize": 20}},
			splitLine: {lineStyle: {color: "#51627D"}}
		},
		series: [{
			symbolSize: 6,
			lineStyle: {normal: {color: '#FEC96A', width: 2}},
			itemStyle: {normal: {color: "#FEC96A"}},
			name: "宽带客户申告", type: 'line', data: seriesDataJson1
		}, {
			symbolSize: 6, lineStyle: {normal: {color: '#62CEEF', width: 2}},
			itemStyle: {normal: {color: "#62CEEF"}},
			name: "ITV客户申告", type: 'line', data: seriesDataJson2
		}, {
			symbolSize: 6, lineStyle: {normal: {color: '#FA4D41', width: 2}},
			itemStyle: {normal: {color: "#FA4D41"}},
			name: "移动网客户申告", type: 'line', data: seriesDataJson3
		}]
	};
	customerComplaints_chart01.setOption(customerComplaints_option01);
}

function handle_zqfw(govCusbarriers) {
	//政企客户申告情况
	var xAixBarriersTime = [], yAixBarriersData = [];
	$.each(govCusbarriers.reverse(), function (index, obj) {
		xAixBarriersTime.push(obj.time.substring(5, 16));
		yAixBarriersData.push(obj.value);
	});
	var government_chart02 = echarts.init(document.getElementById('government_chart02'));
	var government_option02 = {
		tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30, textStyle: {"color": "#fff", "fontSize": 15}},
			splitLine: {show: false},
			data: xAixBarriersTime
		},
		yAxis: {
			type: 'value', axisLine: {lineStyle: {color: '#51627D'}},
			splitLine: {lineStyle: {color: "#51627D"}},
			axisLabel: {formatter: '{value}', textStyle: {"color": "#fff", "fontSize": 20}}
		},
		series: [{
			type: 'line', showAllSymbol: true, symbolSize: 6,
			lineStyle: {normal: {color: '#3E9EDC', width: 2}},
			itemStyle: {normal: {color: "#3E9EDC"}},
			data: yAixBarriersData
		}]
	};
	government_chart02.setOption(government_option02);
}

	   