$(function () {
	send_echo();
});

function send_echo() {
	var echo_websocket = new WebSocket("ws://" + url + "/bigscreen-schedule/websocket/bigScreenWebSocket");
	echo_websocket.onopen = function () {
		console.log('网络信息安全右屏websocket已连接...');
		echo_websocket.send("nontraditionRightScreen");
	};
	//处理服务端返回消息
	echo_websocket.onmessage = function (event) {
		var datas = JSON.parse(event.data);
		console.log(event.data); //处理服务端返回消息
		if (datas.TSR_CODE == "0") {
			baozhangRight(datas.body)
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

function baozhangRight(bodyData) {
	handle_importWebAttacked(bodyData.importWebAttacked || []);
	handle_ITVAttacked(bodyData.ITVAttacked || []);
	handle_JSWebAttacked(bodyData.telecomHall || []);
	handle_governmentAttacked(bodyData.govOffice || []);
}


function handle_importWebAttacked(attackData) {
	//重要网站受攻击情况
	var xAxisInterJson = [], More1GJson = [], More10GJson = [];
	$.each(attackData,function(index,obj){
		xAxisInterJson.push(obj.name);
		More1GJson.push(obj.oneG);
		More10GJson.push(obj.tenG);
	});
	var nontradition_chart1 = echarts.init(document.getElementById('nontradition_chart1'));
	var nontradition_option = {
		tooltip: {trigger: 'axis'},
		legend: {left:"right", data: ['1G以上', '10G以上'], textStyle:{color:'#fff'}},
		calculable: true,
		grid : {height : '130px'},
		xAxis: [{
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30, "interval":0, textStyle: {"color": "#fff", "fontSize": 15}},
			splitLine: {show: false},
			data:xAxisInterJson
		}],
		yAxis: [{
			type: 'value',minInterval : 1, axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel : {formatter: '{value}', textStyle: {"color": "#fff", "fontSize": 20}},
			splitLine:{lineStyle:{color:"#51627D"}}
		}],
		series: [{
			name: '1G以上', type: 'bar',
			itemStyle: {
				normal: {
					color: '#FF9B28',
					label: {
						show: true,
						position: 'top',
						textStyle: {color: '#fff'},
						formatter: function (params) {
							if (params.value == 0) {
								return 0;
							}
							return '';
						}
					}
				}
			},
			data: More1GJson
		}, {
			name: '10G以上', type: 'bar',
			itemStyle: {
				normal: {
					color: '#28EFFF',
					label: {
						show: true,
						position: 'top',
						textStyle: {color: '#fff'},
						formatter: function (params) {
							if (params.value == 0) {
								return 0;
							}
							return '';
						}
					}
				}
			},
			data: More10GJson
		}]
	};
	nontradition_chart1.setOption(nontradition_option);
}

function handle_ITVAttacked(iTVAttackData) {
	//iTV受攻击情况
	var xAxisInterJson = [], loginSucSum = [], tryLoginFailSum = [], illegalLoginSum = [];
	$.each(iTVAttackData.reverse(),function(index,obj){
		xAxisInterJson.push(obj.time.substring(5, 16));
		var vals = obj.value;
		loginSucSum.push(vals.loginSucSum);
		tryLoginFailSum.push(vals.tryLoginFailSum);
		illegalLoginSum.push(vals.illegalLoginSum);
	});
	var nontradition_chart1 = echarts.init(document.getElementById('nontradition_chart2'));
	var nontradition_option = {
		tooltip: {trigger: 'axis'},
		legend: {left:"right", data: ['登录成功总次数', '尝试登录失败总次数', '非法登录总次数'], textStyle:{color:'#fff'}},
		calculable: true,
		xAxis: [{
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30, "interval":0, textStyle: {"color": "#fff", "fontSize":15}},
			splitLine: {show: false},
			data:xAxisInterJson
		}],
		yAxis: [{
			type: 'value',minInterval : 1, axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel : {formatter: '{value}', textStyle: {"color": "#fff", "fontSize":20}},
			splitLine:{lineStyle:{color:"#51627D"}}
		}],
		series: [{
			name: '登录成功总次数', type: 'bar',
			itemStyle: {
				normal: {
					color: '#FF9B28',
					label: {
						show: true,
						position: 'top',
						textStyle: {color: '#fff'},
						formatter: function (params) {
							if (params.value == 0) {
								return 0;
							}
							return '';
						}
					}
				}
			},
			data: loginSucSum
		}, {
			name: '尝试登录失败总次数', type: 'bar',
			itemStyle: {
				normal: {
					color: '#28EFFF',
					label: {
						show: true,
						position: 'top',
						textStyle: {color: '#fff'},
						formatter: function (params) {
							if (params.value == 0) {
								return 0;
							}
							return '';
						}
					}
				}
			},
			data: tryLoginFailSum
		}, {
			name: '非法登录总次数', type: 'bar',
			itemStyle: {
				normal: {
					color: '#FA4D41',
					label: {
						show: true,
						position: 'top',
						textStyle: {color: '#fff'},
						formatter: function (params) {
							if (params.value == 0) {
								return 0;
							}
							return '';
						}
					}
				}
			},
			data: illegalLoginSum
		}]
	};
	nontradition_chart1.setOption(nontradition_option);
}

function handle_JSWebAttacked(publcCusbarriers) {
	//江苏电信网厅受攻击情况
	var xAxisDataJson = [], seriesDataJson1 = [], seriesDataJson2 = [];
	$.each(publcCusbarriers.reverse(), function (index, obj) {
		xAxisDataJson.push(obj.time.substring(5, 10));
		var values = obj.value;
		seriesDataJson1.push(values.oneG);
		seriesDataJson2.push(values.tenG);
	});
	var jswapAttacks_chart01 = echarts.init(document.getElementById('jswapAttacks_chart01'));
	var customerComplaints_option01 = {
		grid: {top: "10%", bottom: "13%", left: "10%", right: "3%"},
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30,"interval": 0, textStyle: {"color": "#fff", "fontSize":20}},
			splitLine: {show: false},
			data: xAxisDataJson
		},
		legend: {
			icon: 'rect', itemWidth: 20, itemHeight: 10, itemGap: 13, x: "right",
			data: ['1G以上', '10G以上'],
			textStyle: {color: '#fff'}
		},
		yAxis: {
			type: 'value',minInterval : 1,
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {textStyle: {"color": "#fff", "fontSize": 20}},
			splitLine: {lineStyle: {color: "#51627D"}}
		},
		series: [{
			symbolSize: 6,
			lineStyle: {normal: {color: '#FEC96A', width: 2}},
			itemStyle: {normal: {color: "#FEC96A"}},
			name: "1G以上", type: 'line', data: seriesDataJson1
		}, {
			symbolSize: 6, lineStyle: {normal: {color: '#62CEEF', width: 2}},
			itemStyle: {normal: {color: "#62CEEF"}},
			name: "10G以上", type: 'line', data: seriesDataJson2
		}]
	};
	jswapAttacks_chart01.setOption(customerComplaints_option01);
}

function handle_governmentAttacked(govCusbarriers) {
	//省政府网站受攻击情况
	var xAxisDataJson = [], seriesDataJson1 = [], seriesDataJson2 = [];
	$.each(govCusbarriers.reverse(), function (index, obj) {
		xAxisDataJson.push(obj.time.substring(5, 10));
		var values = obj.value;
		seriesDataJson1.push(values.oneG);
		seriesDataJson2.push(values.tenG);
	});
	var governmentAttacks_chart2 = echarts.init(document.getElementById('governmentAttacks_chart2'));
	var customerComplaints_option01 = {
		grid: {top: "10%", bottom: "13%", left: "10%", right: "3%"},
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {rotate: 30,"interval": 0, textStyle: {"color": "#fff", "fontSize":20}},
			splitLine: {show: false},
			data: xAxisDataJson
		},
		legend: {
			icon: 'rect', itemWidth: 20, itemHeight: 10, itemGap: 13, x: "right",
			data: ['1G以上', '10G以上'],
			textStyle: {color: '#fff'}
		},
		yAxis: {
			type: 'value',minInterval : 1,
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {textStyle: {"color": "#fff", "fontSize":20}},
			splitLine: {lineStyle: {color: "#51627D"}}
		},
		series: [{
			symbolSize: 6,
			lineStyle: {normal: {color: '#FEC96A', width: 2}},
			itemStyle: {normal: {color: "#FEC96A"}},
			name: "1G以上", type: 'line', data: seriesDataJson1
		}, {
			symbolSize: 6, lineStyle: {normal: {color: '#62CEEF', width: 2}},
			itemStyle: {normal: {color: "#62CEEF"}},
			name: "10G以上", type: 'line', data: seriesDataJson2
		}]
	};
	governmentAttacks_chart2.setOption(customerComplaints_option01);
}
