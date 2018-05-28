$(function () {
	echarts.registerMap('jiangsuJson', jiangsuJson);
	send_echo()
});

function send_echo() {
	var echo_websocket = new WebSocket("ws://" + url + "/bigscreen-schedule/websocket/bigScreenWebSocket");
	echo_websocket.onopen = function () {
		console.log('websocket已连接...');
		echo_websocket.send("broadMiddleScreen");
	};
	//处理服务端返回消息
	echo_websocket.onmessage = function (event) {
		var datas = JSON.parse(event.data);
		console.log("宽带"+event.data); //处理服务端返回消息
		if (datas.TSR_CODE == "0") {
			broadBandMiddle(datas)
		}
	};
	window.onbeforeunload = closeWebSocket
	//关闭WebSocket连接
	function closeWebSocket() {
		echo_websocket.close();
	}
	echo_websocket.onclose = function (event) {};
}

function broadBandMiddle(data) {
	$("#totalShow").html('(' + data.body.renoAndWorkOrder.totalShow.reno + ' / ' + data.body.renoAndWorkOrder.totalShow.work + ')');
	//装机Top3
	var broadTopLists = "",installTopThr = data.body.renoAndWorkOrder.mapShow;
	for (var i = 0; i < 3; i++) {
		broadTopLists += '<div class="wl-skip-box wl-i8">' +
			'<div class="wl-skip-label">' + (i + 1) + '</div>' +
			'<div class="wl-i9">' + installTopThr[i].name + '</div>' +
			'<div>装机工单量:' + installTopThr[i].reno + '</div>' +
			'<div>修障工单量:' + installTopThr[i].work + '</div>' +
			'</div>';
	}
	$("#broadTopDiv").html(broadTopLists);
	//全省装/修情况 (5000/2500)
	var broadBand_chart_Map = echarts.init(document.getElementById('broadBand_chart_Map'));
	var broadMap_option = {
		tooltip: {
			trigger: 'item',
			formatter: function (params) {
				return params.name + ':<br/>装机工单量:' + params.data.reno + '<br/>修障工单量:' + params.data.work;
			}
		},
		series: [{
			type: 'map',
			mapType: 'jiangsuJson',
			label: {
				normal: {show: true, textStyle: {color: '#fff',fontSize:20 }},
				emphasis: {textStyle: {color: '#fff',fontSize:20  }}
			},
			itemStyle: {
				normal: {
					borderColor: '#389BB7',//蓝色
					borderWidth: 2,
					color: function (params) {
						var tmp = params.data.work;						
						if (tmp >= 1000) {
							return '#524D15';
						} else if (tmp>500&&tmp<1000) {
							return '#75AC47';
						} else{
							return '#C0E586';
						}
					}
				},
				emphasis: {areaColor: '#389BB7', borderWidth:2}
			},
			animation: true,
			data:installTopThr
		}]
	};
	broadBand_chart_Map.setOption(broadMap_option);
	
	//当日修/当日装
	var xAxisRepairJson = [], repairJson = [], loadJson = [], repairRateJson = [], loadRateJson = [];
	var dayRepairAndLoad = data.body.dayRepairAndLoad;
	$.each(dayRepairAndLoad, function (index, obj) {
		xAxisRepairJson.push(obj.name);
		repairJson.push(-obj.repair); //当日修
		loadJson.push(obj.load); //当日装
		repairRateJson.push(obj.repairRate); //日修率
		loadRateJson.push(obj.loadRate); //日装率
	});
	var broadBand_chart01 = echarts.init(document.getElementById('broadBand_chart01'));
	var broadBand_option01 = {
		legend: {
			icon: 'rect', itemWidth: 25, itemHeight: 15, itemGap: 15, left: "center",
			data: ['当日修', '当日装', '日修率', '日装率'], textStyle: {color: '#fff',fontSize:20}
		},
		tooltip: {
			trigger: 'axis',
			formatter: function (params) {
				return params[0].name + '<br/>当日装:' + params[0].value +
					'<br/>当日修:' + -params[1].value + '<br/>日装率:' + params[2].value + "%" + '<br/>日修率:' + params[3].value + '%';
			}
			
		},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {
				interval: 0, rotate: 50, margin: 5,
				textStyle: {"color": "#fff", "fontSize":18}
			},
			data: xAxisRepairJson
		},
		yAxis: [{
			name: '数量',
			type: 'value',
			position: 'left',
			inverse: true,
			nameLocation: 'start',
			axisLine: {lineStyle: {color: '#fff'}},
			splitLine: {show: false},
			axisLabel: {
				textStyle: {"color": "#fff", "fontSize":20},
				formatter: function (value) {
					if (value < 0) {return -value}
					return value
				}
			}
		},
			{
				name: '完成率',
				type: 'value',
				position: 'right',
				nameLocation: 'start',
				axisLine: {lineStyle: {color: '#fff'}},
				splitLine: {show: false},
				axisLabel: {
					textStyle: {color: "#fff", fontSize: 20},
					formatter: function (v) {
						if (v < 0) {return -v + '%'}
						return v + '%'
					}
				}
			}],
		series: [{
			type: 'bar',
			stack: 'one',
			name: "当日装",
			yAxisIndex: 0,
			itemStyle: {normal: {color: "#4DBFFF"}},
			data: loadJson
		}, {
			type: 'bar',
			stack: 'one',
			name: "当日修",
			yAxisIndex: 0,
			itemStyle: {normal: {color: "#FFCA6A"}},
			barWidth: 18,
			data: repairJson
		}, {
			type: 'line',
			yAxisIndex: 1,barCategoryGap : '-100%',
			name: "日装率",
			itemStyle: {normal: {color: "#99FFFF"}},
			data: loadRateJson
		}, {
			type: 'line',
			yAxisIndex: 1,barCategoryGap : '-100%',
			name: "日修率",
			itemStyle: {normal: {color: "#cc9933"}},
			data: repairRateJson
		}]
	};
	broadBand_chart01.setOption(broadBand_option01);
	//各地市宽带/iTV在线用户数
	var xAxisJson = [], broadJson = [], itvJson = [], broadBAndItvOnline = data.body.broadBAndItvOnline;
	$.each(broadBAndItvOnline, function (index, obj) {
		xAxisJson.push(obj.name);
		broadJson.push(obj.broad); //宽带用户数
		itvJson.push(obj.itv); //iTV在线用户数
	});
	var broadBand_chart02 = echarts.init(document.getElementById('broadBand_chart02'));
	var broadBand_option02 = {
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			left: "17%"
		},
		xAxis: {
			type: 'category',
			axisLine: {
				lineStyle: {
					color: '#51627D'
				}
			},
			axisLabel: {
				interval: 0,
				rotate: 45,
				margin: 5,
				textStyle: {
					"color": "#fff",
					"fontSize": 20
				}
			},
			splitLine: {
				show: false,
			},
			data: xAxisJson
		},
		legend: {
			icon: 'rect',
			itemWidth: 25,
			itemHeight: 15,
			itemGap: 15,
			left: "right",
			data: ['宽带在线数', 'iTV在线数'],
			textStyle: {
				color: '#fff',
				fontSize:18
			}
		},
		yAxis: {
			type: 'value',
			axisLine: {
				lineStyle: {
					color: '#51627D'
				}
			},
			axisLabel: {
				formatter: '{value}万',
				textStyle: {
					"color": "#fff",
					"fontSize":20
				}
			},
			splitLine: {
				lineStyle: {
					color: "#51627D"
				}
			}
			
		},
		
		series: [{
			symbolSize: 6,
			lineStyle: {
				normal: {
					color: '#FEC96A',
					width: 3,
				},
			},
			itemStyle: {
				normal: {
					color: "#FEC96A"
				}
			},
			name: "宽带在线数",
			type: 'line',
			data: broadJson
		},
			{
				symbolSize: 6,
				lineStyle: {
					normal: {
						color: '#62CEEF',
						width: 3,
					},
				},
				itemStyle: {
					normal: {
						color: "#62CEEF"
					}
				},
				name: "iTV在线数",
				type: 'line',
				data: itvJson
			}]
	};
	broadBand_chart02.setOption(broadBand_option02);
}
