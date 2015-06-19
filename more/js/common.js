var Browser = {
	a : navigator.userAgent.toLowerCase()
}

Browser = {
	ie : Browser.a.indexOf('msie') != -1,
	ie6 : Browser.a.indexOf('msie 6') != -1,
	ie7 : Browser.a.indexOf('msie 7') != -1,
	ie8 : Browser.a.indexOf('msie 8') != -1,
	ie9 : Browser.a.indexOf('msie 9') != -1,
	opera : !!window.opera,
	safari : Browser.a.indexOf('safari') != -1,
	safari3 : Browser.a.indexOf('applewebkit/5') != -1,
	mac : Browser.a.indexOf('mac') != -1,
	chrome : Browser.a.indexOf('chrome') != -1,
	firefox : Browser.a.indexOf('firefox') != -1
}

$(document).ready(function() {
	// 링크에 대한 blur 처리하기
	document.onfocusin=bluring;
	setMenuPos();
	
	$('#menuTbl tr td').click(function(){
		$('#menuTbl tr td').removeClass('on');
		$(this).addClass('on');
	});
	
	$('.top_btns').mouseenter(function(){
		var idx = $('.top_btns').index(this);
		if(!$(this).hasClass('on')){
			var src = $(this).attr('src');
			$(this).attr('src', src.replace('nm', 'ov'));
		}
		
	});
	$('.top_btns').mouseleave(function(){
		var idx = $('.top_btns').index(this);
		if(!$(this).hasClass('on')){
			var src = $(this).attr('src');
			$(this).attr('src', src.replace('ov', 'nm'));
		}
	});
});

function bluring() {
    if(event.srcElement.tagName=="A"||event.srcElement.tagName=="IMG") 
    document.body.focus();
}


function goLink(url) {
	location.href = url;
}


function menuToggle() {
	$("#topMenu2").slideToggle(300);
}



/*
WebFontConfig = {
  custom: {
      families: ['Nanum Gothic'],
      urls: ['http://fonts.googleapis.com/earlyaccess/nanumgothic.css']
  }
};


(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1.4.10/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})(); 
*/


// Scroll Event
/*
$(window).scroll(function(){
	setMenuPos();
}).resize(function(){
	setMenuPos();
});
*/


function setMenuPos() {
	var bWidth = $(window).width();
	var margin = 0;
	var wSize = 1400;
	if (wSize > bWidth) {
		margin = bWidth - wSize;
	}
	$(".imgLeft").css({
		"margin-left": margin + "px"
	});	
}
