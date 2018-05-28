//文字横向滚动
	function ScrollImgLeft1(){ 
		var speed=20;  
		if(window._MyMar){
			clearInterval(window._MyMar);
			window._MyMar = null;　　　　
		}
		var scroll_begin01 = document.getElementById("scroll_begin01");  
		var scroll_end01 = document.getElementById("scroll_end01");  
		var scroll_div01 = document.getElementById("scroll_div01");  
		scroll_end01.innerHTML=scroll_begin01.innerHTML;  
		function Marquee(){   
			if(scroll_end01.offsetWidth<=scroll_div01.scrollLeft){ 
				scroll_div01.scrollLeft-=scroll_begin01.offsetWidth;   				
			}else{   
				scroll_div01.scrollLeft++; 
			}
		}  
		window._MyMar=setInterval(Marquee,speed); 
		scroll_div01.onmouseover = function(){　　　　　　
			　clearInterval(window._MyMar);　　　　
		}　　　　
		scroll_div01.onmouseout = function(){　　　　　　
			　window._MyMar= setInterval(Marquee,speed);　　　　
		}  
	}
	
	function ScrollImgLeft2(){ 
		var speed02 =20;  
		if(window._MyMars){
			clearInterval(window._MyMars);
			window._MyMars = null;　　　　
		}
		var scroll_begin02 = document.getElementById("scroll_begin02");  
		var scroll_end02 = document.getElementById("scroll_end02");  
		var scroll_div02 = document.getElementById("scroll_div02");  
		scroll_end02.innerHTML=scroll_begin02.innerHTML;  
		function Marquee02(){   
			if(scroll_end02.offsetWidth-scroll_div02.scrollLeft<=0){   
				scroll_div02.scrollLeft-=scroll_begin02.offsetWidth;   
			}else{ 
				scroll_div02.scrollLeft++; 
			}
		}  
		window._MyMars=setInterval(Marquee02,speed02); 
		scroll_div02.onmouseover = function(){　　　　　　
			　clearInterval(window._MyMars);　　　　
		}　　　　
		scroll_div02.onmouseout = function(){　　　　　　
			　window._MyMars= setInterval(Marquee02,speed02);　　　　
		}  
	}
	