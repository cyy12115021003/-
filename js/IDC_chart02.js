$(function () {
	echarts.registerMap('china', china);
	send_echo();
});

function send_echo() {
	var echo_websocket = new WebSocket("ws://" + url + "/bigscreen-schedule/websocket/bigScreenWebSocket");
	echo_websocket.onopen = function () {
		console.log('websocket已连接...');
		echo_websocket.send("idcRightScreen");
	};
	//处理服务端返回消息
	echo_websocket.onmessage = function (event) {
		var datas = JSON.parse(event.data);
		console.log(event.data); //处理服务端返回消息
		if (datas.TSR_CODE == "0") {
			IDCRight(datas)
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
	};
}

function IDCRight(data) {
	// 省级流量Top5
	var IDC_chart03 = echarts.init(document.getElementById('IDC_chart03'));
	var myHosName = "江苏";
	var geoCoordMap = {
		'江苏': [120.00, 33.03],
		'安徽': [117.17, 31.52],
		'北京': [116.24, 39.55],
		'重庆': [106.54, 29.59],
		'福建': [119.18, 26.05],
		'甘肃': [103.51, 36.04],
		'广东': [113.14, 23.08],
		'贵州': [106.42, 26.35],
		'海南': [110.20, 20.02],
		'河北': [114.30, 38.02],
		'河南': [113.40, 34.46],
		'黑龙江': [128.36, 45.44],
		'湖北': [112.27, 30.15],
		'湖南': [112.59, 28.12],
		'吉林': [125.19, 43.54],
		'江西': [115.55, 28.40],
		'辽宁': [123.25, 41.48],
		'内蒙': [108.41, 40.48],
		'青海': [101.48, 36.38],
		'山东': [118.00, 36.40],
		'山西': [112.33, 37.54],
		'陕西': [108.57, 34.17],
		'上海': [121.29, 31.14],
		'海南': [108.77, 19.10],
		'四川': [104.04, 30.40],
		'天津': [117.12, 39.02],
		'云南': [102.42, 25.04],
		'浙江': [120.10, 30.16]
	};
	
	var NJData = [
		[{name: "江苏"}, data.body.proFlowTopFiv[0]],
		[{name: "江苏"}, data.body.proFlowTopFiv[1]],
		[{name: "江苏"}, data.body.proFlowTopFiv[2]],
		[{name: "江苏"}, data.body.proFlowTopFiv[3]],
		[{name: "江苏"}, data.body.proFlowTopFiv[4]]
	];
	var planePath = "path://M917.965523 917.331585c0 22.469758-17.891486 40.699957-39.913035 40.699957-22.058388 0-39.913035-18.2302-39.913035-40.699957l-0.075725-0.490164-1.087774 0c-18.945491-157.665903-148.177807-280.296871-306.821991-285.4748-3.412726 0.151449-6.751774 0.562818-10.240225 0.562818-3.450589 0-6.789637-0.410346-10.202363-0.524956-158.606321 5.139044-287.839661 127.806851-306.784128 285.436938l-1.014096 0 0.075725 0.490164c0 22.469758-17.854647 40.699957-39.913035 40.699957s-39.915082-18.2302-39.915082-40.699957l-0.373507-3.789303c0-6.751774 2.026146-12.903891 4.91494-18.531052 21.082154-140.712789 111.075795-258.241552 235.432057-312.784796C288.420387 530.831904 239.989351 444.515003 239.989351 346.604042c0-157.591201 125.33352-285.361213 279.924387-285.361213 154.62873 0 279.960203 127.770012 279.960203 285.361213 0 97.873098-48.391127 184.15316-122.103966 235.545644 124.843356 54.732555 215.099986 172.863023 235.808634 314.211285 2.437515 5.290493 4.01443 10.992355 4.01443 17.181311L917.965523 917.331585zM719.822744 346.679767c0-112.576985-89.544409-203.808826-199.983707-203.808826-110.402459 0-199.944821 91.232864-199.944821 203.808826s89.542362 203.808826 199.944821 203.808826C630.278335 550.488593 719.822744 459.256752 719.822744 346.679767z";
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
	
	var mySeries = [];
	[
		[myHosName, NJData]
	].forEach(function (item, i) {
		mySeries.push({ //线
			name: item[0],
			type: 'lines',
			zlevel: 1,
			effect: {
				show: true,
				period: 6,
				trailLength: 0.7,
				color: '#fff',
				symbolSize: 3
			},
			lineStyle: {
				normal: {
					color: '#FF9A56',
					width: 0,
					curveness: 0.2
				}
			},
			data: convertData(item[1])
		}, { //移动 点
			name: item[0],
			type: 'lines',
			zlevel: 2,
			effect: {
				show: true,
				period: 6,
				trailLength: 0,
				symbol: planePath,
				symbolSize: 10
			},
			lineStyle: {
				normal: {
					color: '#FF9A56',
					width: 1,
					opacity: 1,
					curveness: 0.2
				}
			},
			data: convertData(item[1])
		}, { //省份圆点
			name: item[0],
			type: 'effectScatter',
			coordinateSystem: 'geo',
			zlevel: 2,
			rippleEffect: {
				brushType: 'stroke'
			},
			label: {
				normal: {
					show: true,
					position: 'right',
					formatter: '{b}'
				}
			},
			symbolSize: 12,
			itemStyle: {
				normal: {
					color: function (params) {
						var tmp = params.dataIndex;
						if (tmp == '0') {
							return '#F8E71C';
						} else if (tmp == '1') {
							return '#23FFF4'
						} else if (tmp == '2') {
							return '#FA4D41'
						} else if (tmp == '3') {
							return '#85FF0A'
						} else {
							return '#DD7B87';
						}
					}
				}
			},
			data: item[1].map(function (dataItem) {
				return {
					name: dataItem[1].name,
					value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),
					proportion: dataItem[1].proportion
				};
			})
		});
	});
	
	var IDC_option03 = {
		tooltip: {
			trigger: 'item',
			formatter: function (params) {
				if (params.seriesIndex == 2 || params.seriesIndex == 5 || params.seriesIndex == 8) {
					return params.name + ':' + params.data.proportion + '&nbsp;' + params.data.value[2] + 'G';
				}
			}
		},
		geo: {
			zoom: 3.5,
			map: 'china',
			label: {emphasis: {show: false}},
			roam: true,
			center: [115.55, 28.40],
			silent: true,
			itemStyle: {
				normal: {borderColor: '#1690D4', areaColor: '#04294A'},
				emphasis: {areaColor: '#2a333d'}
			}
		},
		series: mySeries
	};
	IDC_chart03.setOption(IDC_option03);
	
	// 云计算资源统计左
	var xAixYunData = [];
	var resourceUsage = data.body.yunCResource.resourceUsage;
	$.each(resourceUsage, function (index, obj) {
		xAixYunData.push(obj.name);
	});
	var IDC_chart04 = echarts.init(document.getElementById('IDC_chart04'));
	var IDC_option04 = {
		title: {text: "资源使用量(单位:个)", textStyle: {color: "#fff", fontSize: 20}, x: 'center', top: '93%'},
		grid: {top: "2%", bottom: "1%", right: "35%", left: "2%", containLabel: true},
		tooltip: {trigger: "axis", axisPointer: { type: "shadow"}},
		yAxis: [{
			type: "category",
			data: xAixYunData,
			//["省中心", "宿迁", "泰州", "镇江", "扬州","盐城", "淮安", "连云港", "南通", "苏州","常州", "徐州", "无锡", "南京"],
			axisLine: {show: true},
			axisTick: {show: true, alignWithLabel: true},
			axisLabel: {interval: 0, textStyle: {color: "#fff", fontSize: 16}}
		}],
		xAxis: [{
			type: "value",
			axisLine: {show: false},
			axisTick: {show: false},
			axisLabel: {show: false},
			splitLine: {show: false}
		}],
		
		series: [{
			name: "资源使用量",
			type: "bar",
			data: data.body.yunCResource.resourceUsage,
			barCategoryGap: "65%",
			label: {
				normal: {
					show: true,
					position: "right",
					formatter: function (params) {
						return params.data.value + '个';
					},
					textStyle: {
			            color: "#fff",
			            fontSize:15  
			        }
				}
			},
			itemStyle: {normal: {color: '#FFB347'}}
		}]
	};
	IDC_chart04.setOption(IDC_option04);
	//云计算资源统计2
	var IDC_chart05 = echarts.init(document.getElementById('IDC_chart05'));
	var IDC_option05 = {
		color: ['#D56C1C', '#FFD546'],
		title: {
			text: '存储使用率', left: '45%', top: '93%',
			textStyle: {fontSize: 20, color: '#fff'},
			/*subtext:parseInt(data.body.yunCResource.idleResources.free).toLocaleString(),*/
			subtextStyle: {fontSize: 20, color: '#FFD546'}
		},
		tooltip: {trigger: 'item', formatter: "{b}:{d}%"},
		legend: {top: "5%", left: "35%", data: ['空闲', '在用'], textStyle: {color: '#fff',fontSize: 16}},
		series: [{
			name: '总空闲资源',
			type: 'pie',
			center: ['65%', '60%'],
			radius: ['50%', '70%'],
			avoidLabelOverlap: false,
			data: [{
				value: data.body.yunCResource.idleResources.free, name: '空闲',
				itemStyle: {normal: {label: { show: false}, labelLine: { show: false}}}
			}, {
				value: data.body.yunCResource.idleResources.use, name: '在用',
				itemStyle: {normal: {label: {show: true, formatter: '{d}%'}, labelLine: {show: true}}}
			}]
		}]
	};
	IDC_chart05.setOption(IDC_option05);
	//最右边数据
	$("#alarmNumber").text(data.body.alarAll.value);
	if (data.body.alarAll.status == "0") {
		$("#alarmNumber").next().text("正常");
	} else {
		$("#alarmNumber").next().text("不正常");
	}
	$("#alarImportNumber").text(data.body.alarImport.value);
	if (data.body.alarImport.status == "0") {
		$("#alarImportNumber").next().text("正常");
	} else {
		$("#alarImportNumber").next().text("不正常");
	}
	$("#orderNumber").text(data.body.orderAll.value);
	if (data.body.orderAll.status == "0") {
		$("#orderNumber").next().text("正常");
	} else {
		$("#orderNumber").next().text("不正常");
	}
	//表格
	var alarmLists = "";
	for (var i = 0; i < data.body.alarFormdata.length; i++) {
		alarmLists += '<tr class="wl-table-list"><td>' +
			data.body.alarFormdata[i].name + '</td><td>' +
			data.body.alarFormdata[i].alar + '</td><td>' +
			data.body.alarFormdata[i].order + '</td><td>' +
			data.body.alarFormdata[i].officeOrder + '</td><tr>';
	}
	$("#alarList").html(alarmLists);
	//重大障碍升级
	var maj_upgradList = "";
	for (var j = 0; j < data.body.majUpgrad.length; j++) {
		maj_upgradList += '<span>' + data.body.majUpgrad[j] + '</span>';
	}
	$("#scroll_begin01").html(maj_upgradList);
	ScrollImgLeft1();
	//风险操作
	var risk_operatList = "";
	var risklength = data.body.riskOperat.length;
	for (var m = 0; m < risklength; m++) {
		$("#riskLength").html('(' + risklength + ')');
		risk_operatList += '<span>' + (m + 1) + ':' + data.body.riskOperat[m] + '</span>';
	}
	$("#scroll_begin02").html(risk_operatList);
	ScrollImgLeft2();
}
