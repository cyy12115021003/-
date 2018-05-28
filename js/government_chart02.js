$(function () {
	send_echo();
	$toolTipDIv = $("#toolTipDIv");
	imgsParent = $("#imgList").parent()[0];
	p_top = imgsParent.offsetTop;
	p_left = imgsParent.offsetLeft;
	imgsParent_01 = $("#imgListCity").parent()[0];
	p_top_01 = imgsParent_01.offsetTop;
	p_left_01 = imgsParent_01.offsetLeft;
	tipWidth = 214;
	$toolTipDIv.css('width', tipWidth+'px');
	$imgList = $("#imgList");
	$centerDiv = $("#centerDiv");
	hoverClz = 'hoveredLi';
});

function send_echo() {
	var echo_websocket = new WebSocket("ws://" + url + "/bigscreen-schedule/websocket/bigScreenWebSocket");
	echo_websocket.onopen = function () {
		console.log('websocket已连接...');
		echo_websocket.send("govRightScreen");
	};
	//处理服务端返回消息
	echo_websocket.onmessage = function (event) {
		var datas = JSON.parse(event.data);
		console.log(event.data); //处理服务端返回消息
		if (datas.TSR_CODE == "0") {
			governRight(datas)
		}
	};
	window.onbeforeunload = closeWebSocket;
	
	function closeWebSocket() {
		echo_websocket.close();
	}
	
	echo_websocket.onclose = function (event) {};
}

function governRight(data) {
	looping = false;
	//各地市物联网用户数
	var xAixTopCity = [], yAixTopData = [], inteetOfThingsUser = data.body.internetOfThingsUser,sum = 0;
	$.each(inteetOfThingsUser, function (index, obj) {
		xAixTopCity.push(obj.name);
		yAixTopData.push(obj.value);
		var num = parseInt(obj.value);		
		sum += num;
	});
	$('#sum_IOTuser_span').html(sum);
	var government_chart03 = echarts.init(document.getElementById('government_chart03'));
	var government_option03 = {
		tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
		grid: {left: "2%", right: "1%", top: "8%", bottom: "15%"},
		xAxis: {
			axisLabel: {show: true, interval: 0, textStyle: {color: '#fff', fontSize: 18}},
			show: true, data: xAixTopCity
		},
		yAxis: {show: false},
		series: [{
			type: 'bar',
			barWidth: 20,
			itemStyle: {normal: {color: '#FFCA6A'}},
			label: {normal: {show: true, position: 'top', formatter: function (obj) {return obj.value;}, textStyle: {color: '#fff',fontSize:15}}},
			data: yAixTopData
		}]
	};
	government_chart03.setOption(government_option03);
	//全省4G物联网并发用户数
	var xAixDatas = [], yAixDatas = [], fouGInteetUser = data.body.fouGInternetUser;
	$.each(fouGInteetUser, function (index, obj) {
		xAixDatas.push(obj.name);
		yAixDatas.push(obj.value);
		
	});
	
	var government_chart04 = echarts.init(document.getElementById('government_chart04'));
	var government_option04 = {
		tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
		grid: {left: "12%", right: "1%", top: "8%", bottom: "10%"},
		xAxis: {
			type: 'category',
			axisLine: {lineStyle: {color: '#51627D'}},
			axisLabel: {interval: 0, textStyle: {"color": "#fff", "fontSize":20}},
			splitLine: {show: false},
			data: xAixDatas
		},
		yAxis: {
			type: 'value',
			axisLine: {lineStyle: {color: '#51627D'}},
			splitLine: {lineStyle: {color: "#51627D"}},
			axisLabel: {formatter: '{value}', textStyle: {"color": "#fff", "fontSize": 20}}
		},
		series: [{
			type: 'line',
			symbolSize: 6,
			showAllSymbol: true,
			lineStyle: {normal: {color: '#6ADDFF', width: 2}},
			itemStyle: {normal: {color: "#6ADDFF"}},
			data: yAixDatas
		}]
	};
	government_chart04.setOption(government_option04);

	//专属中心
	var $imgList = $("#imgList"),$imgListCity = $("#imgListCity"),imgLists = "",imgListCityList = "", items = data.body.centerData;
	if(items&&items.length>0){
		for (var m = 0; m < items.length; m++) {
			var item = items[m],isZero = item.centerCompNum;	
			htmls = '<li class="wl-o1"><div class="'+ (isZero == 0?'noticeGreen':'notice')+'">'+isZero+'</div><img src="' + item.centerLOGO + '"  onmouseover="showText(this,\''+item.level+'\', \'' + item.centerName + '\',\'' + item.centerOrders + '\')" onmouseout="hideText()";/></li>';		
			if(item.level == 0){     //0省级   1市级
				imgLists += htmls;
			}else{
				imgListCityList += htmls;
			}			
		}
		$imgList.html(imgLists);
		$imgListCity.html(imgListCityList);
	}		
}

//hover事件
function showText(img,level,name,centerOrders) {	
	img = img.parentNode;
	var pTop = p_top, pLeft = p_left;
	if(level != 0){
		pTop = p_top_01;
		pLeft = p_left_01;
	}	
	$toolTipDIv.html('<p>' + name + '</p><div class="wl-b1"><p class="wl-c6 wl-k8">工单号：</p><p id="orderCode" class="wl-k12"></p></div>')
	.show().css({top : pTop + img.offsetHeight + img.offsetTop - 12 + 'px', left : pLeft + (img.offsetWidth/2 + img.offsetLeft- tipWidth/2) + 'px'});
	
	$centerDiv.find('li.'+hoverClz).removeClass(hoverClz);
	
	var arrCenterOrders = centerOrders.split(',');
	if(centerOrders.length == 0){
		$("#orderCode").html("暂无");
	}else{
		var centerOrdersShow = "";
		for(var n in arrCenterOrders){
			centerOrdersShow += '<p>'+arrCenterOrders[n]+'</p>';			
		}		
		$("#orderCode").html(centerOrdersShow);		
	}	
}

function hideText() {
	$toolTipDIv.hide();
	$centerDiv.find('li.'+hoverClz).removeClass(hoverClz);
}