var Browser = {
	a : navigator.userAgent.toLowerCase()
};

Browser = {
	opera : !!window.opera,
	safari : Browser.a.indexOf('safari') != -1,
	safari3 : Browser.a.indexOf('applewebkit/5') != -1,
	mac : Browser.a.indexOf('mac') != -1,
	chrome : Browser.a.indexOf('chrome') != -1,
	firefox : Browser.a.indexOf('firefox') != -1
};

$(document).ready(function() {
	// 메뉴클릭
	$('.menu_btn').click(function(){
		var _this = this;
		if($('.menu_right').is(':visible') ){
			$('.menu_right').hide();
			$('.other_btn').removeClass('on');
		}
		if($(this).hasClass('on')){
			$('.menu_left').slideUp(300, function(){
				$(_this).removeClass('on');
			});
		}else{
			$('.menu_left').slideDown(300, function(){
				$(_this).addClass('on');
			});
		}
	});
	
	$('.other_btn').click(function(){
		var _this = this;
		if($('.menu_left').is(':visible') ){
			$('.menu_left').hide();
			$('.menu_btn').removeClass('on');
		}
		if($(this).hasClass('on')){
			$('.menu_right').slideUp(300, function(){
				$(_this).removeClass('on');
			});
		}else{
			$('.menu_right').slideDown(300, function(){
				$(_this).addClass('on');
			});
		}
	});
});



