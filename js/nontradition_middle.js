$(function () {
	echarts.registerMap('jiangsuJson', jiangsuJson);
	send_echo();
});

function send_echo() {
	var echo_websocket = new WebSocket("ws://" + url + "/bigscreen-schedule/websocket/bigScreenWebSocket");
	echo_websocket.onopen = function () {
		console.log('网络信息安全中屏websocket已连接...');
		echo_websocket.send("nontraditionMiddelScreen");
	};
	//处理服务端返回消息
	echo_websocket.onmessage = function (event) {
		var datas = JSON.parse(event.data);
		console.log(event.data); //处理服务端返回消息
		if (datas.TSR_CODE == "0") {
			baozhangRight(datas.body)
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
	handle_attackMap(bodyData.cityAttacked || []);
	handle_DDoS_attack(bodyData.DDOS || []);
	handle_worm(bodyData.StiffWoodCreep || []);
}

function handle_attackMap(attackData) {
	//各地市流量攻击分布情况
	var showData = [], attackSum = {insrc : 0, indst : 0, outsrc : 0, outdst : 0};
	$.each(attackData, function (i ,v) {
		var nv = {name : v.area + '市'}, points = v.points;
		nv.insrc = Number(points.in.src + '');
		nv.indst = Number(points.in.dst + '');
		nv.outsrc = Number(points.out.src + '');
		nv.outdst = Number(points.out.dst + '');
		attackSum.insrc += nv.insrc;
		attackSum.indst += nv.indst;
		attackSum.outsrc += nv.outsrc;
		attackSum.outdst += nv.outdst;
		showData.push(nv)
	});
	$('#insrc_span').html(attackSum.insrc + attackSum.outsrc);
	$('#indst_span').html(attackSum.indst + attackSum.outdst);
	//$('#outsrc_span').html(attackSum.outsrc);
	//$('#outdst_span').html(attackSum.outdst);
	var attack_chart_Map = echarts.init(document.getElementById('attack_chart_Map'));
	var broadMap_option = {
		tooltip: {
			trigger: 'item',
			formatter: function(params) {
				var data = params.data;
				//return data.name + ':<br/>对本省发起攻击源数量:'+ data.insrc + '<br/>本省对省内攻击源数量:' + data.indst + '<br/>对省外发起攻击源数量:' + data.outsrc + '<br/>省外对省内攻击源数量:' + data.outdst;
				return data.name + ':<br/>省内源发攻击肉鸡数:'+ (data.insrc + data.outsrc) + '<br/>省内遭受攻击目标数:' + ( data.indst + data.outdst);
			}
		},
		series: [{
			type: 'map',
			mapType:'jiangsuJson',
			label: {
				normal: {show: true, textStyle:{color: '#fff',fontSize:20}},
				emphasis: {textStyle: {color: '#fff',fontSize:20}}
			},
			itemStyle: {
				normal: {
					borderColor: '#389BB7',//蓝色
					borderWidth: 2,
					color: function(params) {
						var data = params.data, color = 'green';
						if (typeof data.indst != 'undefined'){
							var sum = data.insrc + data.indst + data.outsrc + data.outdst;
							if (sum <= 1000 ){
								color = 'green';
							} else if (sum <=5000 ){
								color = 'orange';
							} else {
								color = 'red';
							}
						}
						return color;
					}
				},
				emphasis: {areaColor: '#389BB7', borderWidth:2}
			},
			animation: true,
			data:showData
		}]
	};
	attack_chart_Map.setOption(broadMap_option);
}

function handle_DDoS_attack(attackData) {
	//DDoS攻击风险排行
	var xAxisInterJson = [], attackJson = [], attackedGJson = [];
	$.each(attackData,function(index,obj){
		xAxisInterJson.push(obj.name);
		attackJson.push(obj.DAttack);
		attackedGJson.push(obj.DAttacked);
	});
	var nontradition_chart1 = echarts.init(document.getElementById('DDoS_attack_chart'));
	var nontradition_option = {
		tooltip: {trigger: 'axis'},
		legend: {left:"right", data: ['发起攻击', '遭受攻击'], textStyle:{color:'#fff'}},
		calculable: true,
		xAxis: [{
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {"interval":0, textStyle: {"color": "#fff", "fontSize":20}},
			splitLine: {show: false},
			data:xAxisInterJson
		}],
		yAxis: [{
			type: 'value',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel : {formatter: '{value}', textStyle: {"color": "#fff", "fontSize":20}},
			splitLine:{lineStyle:{color:"#51627D"}}
		}],
		series: [{
			name: '发起攻击', type: 'bar',
			itemStyle: {normal: {color: '#FF9B28'}},
			data:attackJson
		}, {
			name: '遭受攻击', type: 'bar',
			itemStyle: {normal: {color: '#28EFFF'}},
			data:attackedGJson
		}]
	};
	nontradition_chart1.setOption(nontradition_option);
}

function handle_worm(attackData) {
	//僵木蠕事件风险排行
	var xAxisInterJson = [], SAttackJSON = [], SAttackedJSON = [];
	$.each(attackData,function(index,obj){
		xAxisInterJson.push(obj.name);
		SAttackJSON.push(obj.SAttack);
		SAttackedJSON.push(obj.SAttacked);
	});
	var nontradition_chart1 = echarts.init(document.getElementById('worm_chart'));
	var nontradition_option = {
		tooltip: {trigger: 'axis'},
		legend: {left:"right", data: ['主控端', '受控端'], textStyle:{color:'#fff'}},
		calculable: true,
		xAxis: [{
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {"interval":0, textStyle: {"color": "#fff", "fontSize":20}},
			splitLine: {show: false},
			data:xAxisInterJson
		}],
		yAxis: [{
			type: 'value',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel : {textStyle: {"color": "#fff", "fontSize":20}},
			splitLine:{lineStyle:{color:"#51627D"}}
		}],
		series: [{
			name: '主控端', type: 'bar',
			itemStyle: {normal: {color: '#FF9B28'}},
			data:SAttackJSON
		}, {
			name: '受控端', type: 'bar',
			itemStyle: {normal: {color: '#28EFFF'}},
			data:SAttackedJSON
		}]
	};
	nontradition_chart1.setOption(nontradition_option);
}
