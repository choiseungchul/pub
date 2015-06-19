/**
 * New node file
 */
$(document).ready(function(){
	$('.price_btn').mouseenter(function(){		
		var src = $(this).find('img').attr('src');
		$(this).find('img').attr('src', src.replace('_off','_on'));
		$(this).find('span.btn.medium').addClass('on');
	});
	$('.price_btn').mouseleave(function(){
		var src = $(this).find('img').attr('src');
		$(this).find('img').attr('src', src.replace('_on','_off'));
		$(this).find('span.btn.medium').removeClass('on');
	});
});