
var _st = window.setTimeout;

window.setTimeout = function(fRef, mDelay) { 
    if(typeof fRef == "function") {  
        var argu = Array.prototype.slice.call(arguments,2); 
        var f = (function(){ fRef.apply(null, argu); }); 
        return _st(f, mDelay); 
    } 
    return _st(fRef,mDelay);
};

var wshostname = window.location.protocol + '//' + window.location.host;

var draw;
var drawStart = false;
var socket;
var isMobile = false;
var roomid = -1;
var username = '';
var mypic = '';
var isMaster = false;
var color = '#000000';
var strokeWidth = 3;
var isob = false;
var isDrawer = false;
var gamestarted = false; 
var email = '';
var profileid = -1;
var answer = '';

var isCorrectBrowser = false;


$(document).ready(function(){

	$.modal("<img src='/img/ajax-loader.gif'>", { opacity : 60 });

	draw = document.getElementById("drawimg").getContext("2d");
	draw.strokeWidth = strokeWidth;
	draw.strokeStyle = color;
	draw.lineCap = 'round';

	if(Browser.chrome || Browser.firefox || Browser.opera || Browser.safari || Browser.safari3 ){
		isCorrectBrowser = true;
	}else{
		isCorrectBrowser = false;
		alert('해당 브라우저는 게임을 지원하지 않습니다.');
	}
	
});

function init(){

	socket = io.connect();

	var params = location.search.split("&");
	
	var room = params[0].split("=")[1];
	
	if (room != -1){
		
		var isPlay = params[1].split("=")[1];
		
		if (parseInt(isPlay) == 0){
			roomid = parseInt(room);
			socket.emit('intoroom', {id : roomid, username:username, play : 0, pics :mypic});
			getRoomMembers();
		}else if (parseInt(isPlay) == 1){
			roomid = parseInt(room);
			socket.emit('intoroom', {id : roomid, username:username, play : 1, pics :mypic});
			getRoomMembers();
			isob = true;
			getDrawInfo();
		}
		
		getRoomInfo();
	
	}else{
		var roomname = params[1].split("=")[1];
		
		$('.roomname').text(decodeURI(roomname));
		
		isMaster = true;
		
		$.ajax({
			url : wshostname+'/method/?a=chkroom&rname=' + roomname,
			method : 'get',
			async : false,
			success : function(dt){
				//console.log(dt);
				if (dt == '1') {
					alert('이미 생성된 방입니다.');
					window.close();
				}else if(dt == '0') {
					socket.emit('makeroom', {roomname : roomname, username : username , pics : mypic});
				}
			}
		});
	}
	
	var userAgent = navigator.userAgent.toLowerCase();
	
//	$('.stat').append($('<p />').text('Client : ' + userAgent));
	
	if(userAgent.indexOf('android') != -1 || userAgent.indexOf('iphone') != -1 ||userAgent.indexOf('ipad') != -1 || userAgent.indexOf('ipod') != -1){
		isMobile = true;
	}
	/*
	if (isMobile){
		$('head').append($('<meta name="viewport" content="user-scalable=no, initial-scale=0.6, maximum-scale=0.6, minimum-scale=0.6, width=device-width" />'));
	}
	*/ 
	
	socket.on('roomismaked', function(data){
		roomid = data.rid;
		getRoomMembers();
	});
	
	socket.on('bschat', function(data){
		printChatMsg(data.username + ": " + data.message);
	});
	
	socket.on('intouser', function(data){
		printSystemMsg(data.username + "님이 입장하셨습니다.");
		getRoomMembers();
	});
	
	socket.on('intouserob', function(data){
		printSystemMsg(data.username + "님이 관전자로 입장하셨습니다.");
	});
	
	socket.on('leaveuser', function(data){
		printSystemMsg(data.username + "님이 퇴장하셨습니다.");
		getRoomMembers();
	});
	
	socket.on('mousedown', function(data){
		if (data.x != undefined && data.y != undefined){
			draw.beginPath(data.x, data.y);
			draw.strokeStyle = data.color;
			draw.lineWidth = data.width;
		}
	});
	
	socket.on('mousemove', function(data){
		if (data.x != undefined && data.y != undefined){
			draw.lineTo(data.x, data.y);
			
			draw.stroke();
		}
	});
	
	socket.on('mouseup', function(data){
		draw.closePath();
	});
	
	socket.on('nextuser', function(data){
		alert_layer(data.username + '님의 차례입니다.');
		gamestarted = true;
		if ( data.username == username ){
			drawEventAdd();
			startTimer();
			isDrawer = true;
		}else{
			drawEventRemove();
			startTimer();
			isDrawer = false;
		}
	});
	
	socket.on('correctas', function(data){
		alert_layer(data.username + '님이 정답을 맞추셨습니다. <br />정답 : ' + data.answer);
		stopTimer();
		if(isDrawer){ saveMyDraw(answer); }
		clearMyCanvas();
	});
	
	socket.on('timeoutas', function(data){
		alert_layer('시간이 초과 되었습니다. <br />정답 : ' + data.answer);
		stopTimer();
		if(isDrawer){ saveMyDraw(answer); }
		clearMyCanvas();
	});
	
	socket.on('reanswer', function(data){
		////console.log(data);
		if (username == data.username){
			answer = data.answer;
			$('.answer').text(data.answer);
			var reansbtn = $('<input type="button" value="변경하기" onclick="changeAnswer()" />');
			$('.answer').append(reansbtn);
		}else{
			$('.answer').text(data.answer.length + '자');
		}
		
		printSystemMsg('답이 변경되었습니다.');
	});
	
	socket.on('answer', function(data){
		//console.log(data);
		if (username == data.username){
			answer = data.answer;
			$('.answer').text(data.answer);
			var reansbtn = $('<input type="button" value="변경하기" onclick="changeAnswer()" />');
			$('.answer').append(reansbtn);
		}else{
			$('.answer').text(data.answer.length + '자');
		}
	});
	
	socket.on('gameend', function(){
		drawEventRemove();
		
		gamestarted = false;
		
		if(isMaster){
			$('.starter').show();
		}
		
		alert_layer('게임이 종료 되었습니다.');
		printSystemMsg('게임이 종료 되었습니다.');
		
		var rn = getRoomInfo();
		
		clearInterval(timerInterval);
		
		if(isMaster)
		socket.emit('roomchange', {id : roomid, played : 0, name : rn });
	});
	
	socket.on('clearcanvas', function(data){
		draw.clearRect(0,0,720,480);
	});
	
	$('#chatInput').keydown(function(e){
		if (e.which === 13) {
			if ($(this).val() != ''){
				if(isob || isDrawer ){
					socket.emit('chatinput', {roomid: roomid, username : username,  message : $(this).val()});
					$(this).val('');
				}else{
					var txt = $(this).val();
					if(gamestarted)
					socket.emit('chkanswer', {rid : roomid, username : username , answer : txt});
					
					socket.emit('chatinput', {roomid: roomid, username : username,  message : $(this).val()});
					$(this).val('');
				}
				
			}
		}
	});
}

function clearMyCanvas(){
	draw.clearRect(0,0,720,480);
}

function changeAnswer(){
	socket.emit('changeanswer', {rid : roomid, username : username});
}

function gameStart(){
	if (isMaster && !gamestarted){
		socket.emit('gamestart', {rid : roomid});
		$('.starter').hide();
		
		var rn = getRoomInfo();
		
		socket.emit('roomchange', {id : roomid, played : 1, name : rn });
	}
}

function setMaster(){
	
}

function printSystemMsg(msg){
	$('.msgcont').append($('<p class="sysmsg"/>').text(msg));
	$('.msgcont').scrollTop($('.msgcont p').size()*24 + 100);
}
function printChatMsg(msg){
	$('.msgcont').append($('<p class="chatmsg"/>').text(msg));
	$('.msgcont').scrollTop($('.msgcont p').size()*24 + 100);
}
function drawEventAdd(){
	
	$('.c_red').click(function(){
		color = 'red';
	});
	$('.c_blue').click(function(){
		color = 'blue';
	});
	$('.c_green').click(function(){
		color = 'green';
	});
	$('.c_black').click(function(){
		color = 'black';
	});
	$('.c_yellow').click(function(){
		color = 'yellow';
	});
	
	$( ".linewidth" ).slider( "option", "disabled", false );
	
	$('.linewidth').bind('slidechange', function(event, ui){
		$('.linepx').text(ui.value + ' px');
		strokeWidth = ui.value;
	});
	
	if (!isMobile){
		$('#drawimg').mousedown(function(e){
			drawStart = true;
			var _x = Math.floor( e.pageX - $(this).offset().left );
			var _y = Math.floor( e.pageY - $(this).offset().top );
			socket.emit('mousedown', { ac : 'mdown', roomid: roomid, x : _x , y : _y, color : color, width : strokeWidth});
		});
		
		$('#drawimg').mousemove(function(e){
			if (drawStart){
				var _x = Math.floor( e.pageX - $(this).offset().left );
				var _y = Math.floor( e.pageY - $(this).offset().top );
				
				if (_x != undefined && _y != undefined){
					socket.emit('mousemove', { ac : 'mmove', roomid: roomid, x : _x , y : _y});
				}
			}
		});
		
		$('#drawimg').mouseup(function(e){
			drawStart = false;
			socket.emit('mouseup', {ac : 'mup'});
		});
		
		$('#drawimg').mouseleave(function(e){
			drawStart = false;
		});
	}
	/*
	else{
		$('#drawimg').touchstart(function(e){
			drawStart = true;
			var _x = Math.floor( e.pageX - $(this).offset().left );
			var _y = Math.floor( e.pageY - $(this).offset().top );
			socket.emit('mousedown', {x : _x , y : _y});
		});
		
		$('#drawimg').touchmove(function(e){
			e.preventDefault();
			if (drawStart){
				var _x = Math.floor( e.pageX - $(this).offset().left );
				var _y = Math.floor( e.pageY - $(this).offset().top );
				
				if (_x != undefined && _y != undefined){
					socket.emit('mousemove', {x : _x , y : _y});
				}
			}
		});
		
		$('#drawimg').touchend(function(e){
			drawStart = false;
			socket.emit('mouseup', {});
		});
	}
	*/
}

function drawEventRemove(){
	
	$('.c_red').unbind('click');
	$('.c_green').unbind('click');
	$('.c_black').unbind('click');
	$('.c_yellow').unbind('click');
	$('.c_blue').unbind('click');
	
	$( ".linewidth" ).slider( "option", "disabled", true );
	$('.linewidth').unbind('slidechange');
	
	if (!isMobile){
		$('#drawimg').unbind('mousedown');
		$('#drawimg').unbind('mousemove');
		$('#drawimg').unbind('mouseup');
	}
}

function clearCanvas(){
	if (isDrawer){
		socket.emit('clearcanvas',{ rid : roomid });
	}
}

function GetCookie(name) {
    var nameOfCookie = name + "=";
    var x = 0;
    while (x <= document.cookie.length) {
        var y = (x + nameOfCookie.length);
        if (document.cookie.substring(x, y) == nameOfCookie) {
            if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
                endOfCookie = document.cookie.length;
            return unescape(document.cookie.substring(y, endOfCookie));
        }
        x = document.cookie.indexOf(" ", x) + 1;
        if (x == 0)
            break;
    }
    return "";
}

function getRoomInfo(){
	var rn = '';
	$.ajax({
		url : wshostname+'/method/?a=roominfoall&rid=' + roomid,
		method : 'get',
		async : false,
		success : function(dt){
			
			var room = JSON.parse(dt);
			rn = room.name;
			$('.roomname').text(room.name);
		}
	});
	
	return rn;
}

function getRoomMembers(){
	$.ajax({
		url : wshostname+'/method/?a=roominfouser&rid=' + roomid,
		method : 'get',
		async : false,
		success : function(dt){
			
			if (dt != '0'){
				var users = dt.split(':::');
				var pics = users[0].split(',');
				var master = users[2];
				var userarr = users[1].split(',');
				
				$('.userlist').empty();
				
				for (var i = 0 ; i < userarr.length; i++){
					
					var name = userarr[i];
					var pic_s = pics[i];
					
					if( master ==  userarr[i] ){
						var userbox = '<div class="user_box"><div class="userpic"><div class="msg_cloud"></div><img class="userpicture" src="'+pic_s+'" alt=""></div><div class="userinfo"><div class="user_name">'+name+' (방장)</div><div class="user_grade">Lv. 1</div></div></div>';
						$('.userlist').append(userbox);
					}else{
						var userbox = '<div class="user_box"><div class="userpic"><div class="msg_cloud"></div><img class="userpicture" src="'+pic_s+'" alt=""></div><div class="userinfo"><div class="user_name">'+name+'</div><div class="user_grade">Lv. 1</div></div></div>';
						$('.userlist').append(userbox);
					}
				}
				
				if (master == username && userarr.length > 1){
					isMaster = true;
					if(gamestarted){
						$('.starter').hide();
					}else{
						$('.starter').show();
					}
				}else{
					isMaster = false;
					$('.starter').hide();
				}
			}
		}
	});
}

function getDrawInfo(){
	if ( roomid == -1 ) return;
	$.ajax({
		url : wshostname+'/method/?a=drawinfo&rid=' + roomid,
		method : 'get',
		async : false,
		success : function(dt){
		
			var draws = JSON.parse(dt);
			for (var i = 0 ; i < draws.length ; i++){
				
				var data = draws[i];
				
				if (data.ac == 'mdown'){
					if (data.x != undefined && data.y != undefined){
						draw.beginPath(data.x, data.y);
						draw.strokeStyle = data.color;
						draw.lineWidth = data.width;
					}
				}else if (data.ac == 'mmove'){
					if (data.x != undefined && data.y != undefined){
						draw.lineTo(data.x, data.y);
						draw.stroke();
					}
				}
			}
			draw.closePath();
		}
	});
}

var layers = 0;

function alert_layer(msg){
	setTimeout(show_alert, layers * 1500, msg);
	layers++;
}

function show_alert(msg){
	var layer =  $('.wrap_alert').clone();
	layer.find('p').html(msg);
	$('body').before(layer);
	layer.fadeIn(300);
	setTimeout(close_alert, 1500, layer);
}

function close_alert(obj){
	obj.fadeOut(300);
	setTimeout(function(){ obj.remove(); }, 300);
	layers--;
}

var timerSec = 180;
var timerInterval = -1;

function startTimer(){
	timerInterval = setInterval(function(){
		
		timerSec--;
		
		$('.min').text('0'+Math.floor(timerSec/60));
		var sec = timerSec%60;
		if(sec > 9){
			$('.second').text(sec);
		}else{
			$('.second').text('0'+sec);
		}
	
		if (timerSec == 0){
			stopTimerByTime();
		}
	}, 1000);
}

function stopTimer(){
	clearInterval(timerInterval);
	timerSec = 180;
	$('.min').text('00');
	$('.sec').text('00');
}

function stopTimerByTime(){
	clearInterval(timerInterval);
	timerSec = 180;
	$('.min').text('00');
	$('.sec').text('00');
	if (isDrawer){
		socket.emit('timeoutas', {rid : roomid ,username : username});
	}
}

function removechat(){
	$('.msgcont').empty();
}


// Facebook

var appid = '159855520819653';
var uid = '';
var accessToken;
  window.fbAsyncInit = function() {
    FB.init({
      appId      : appid, // App ID
      //channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    FB.getLoginStatus(handleUserStateChange); 

    function handleUserStateChange(response) {
  		//alert(response.status);
	  if (!response.authResponse) {
	  		var redirect_uri = 'http://scminddev.cafe24app.com/a.html';
	  		var scope = 'publish_stream,user_about_me,email,friends_photos,user_location';
	        location.href = 'https://graph.facebook.com/oauth/authorize?client_id='+appid+'&scope='+scope+'&redirect_uri=' + redirect_uri;
	        
      } else {
  	 		uid = response.authResponse.userID;
			accessToken = response.authResponse.accessToken;
			
			getMyInfo();
  	  }
    }
  
  };

//Load the SDK Asynchronously
(function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
 }(document));

function getMyInfo(){
	var uid = '';
		FB.api('/me', function(res){
			uid = res.id;
			FB.api( 
		    {
		    	method: 'fql.query', 
		    	query: 'select uid,name,email,pic_square, pic from user where uid  = "' + uid + '"'
		    },
			function(response) {
		    	for(var i=0; i < response.length; i++){
	    	       var id = response[i].uid; //유저아이디
	    	       var pic_s = response[i].pic_square; // 작은사진
	    	       var name = response[i].name; // 이름
	    	       var email = response[i].email; // 이메일주소
	    	       
	    	       //var userbox = '<div class="user_box"><div class="userpic"><div class="msg_cloud"></div><img class="userpicture" src="'+pic_s+'" alt=""></div><div class="userinfo"><div class="user_name">'+name+'</div><div class="user_grade">Lv. 1</div></div></div>';
	    	       
	    	       //$('.userlist').append($(userbox));
	    	       
				   profileid = id;
	    	       username = name;
	    	       mypic = pic_s;
				   email = email;
	    	       
	    	       $('#chatInput').removeAttr('disabled');
	    	       
	    	    }
		    	
		    	init();

				$.modal.close();
			}
		); 
	});
}

function saveMyDraw(answer){

	var canvas = document.getElementById("drawimg");
	var data = canvas.toDataURL("image/png");
	
	data = data.split(',')[1];

	$.ajax({
		type : 'post',
		url :  'http://arcray.dothome.co.kr/scminddev/reciever/pics.php',
		async : false,
		data : { mode:'add', pid : profileid, durl : data, picname : answer },
		success : function(dt){
		},
		error : function(e){
			//console.log(e);
		}
	});
}

function saveDrawing() {

	var picname = window.prompt('이미지의 제목을 입력해주세요','');

	var canvas = document.getElementById("drawimg");
	var data;

	data = canvas.toDataURL("image/png");
	
	data = data.split(',')[1];

	if(picname != '' && picname != null){

		$.ajax({
			type : 'post',
			url :  'http://arcray.dothome.co.kr/scminddev/reciever/pics.php',
			async : false,
			data : { mode:'add', pid : profileid, durl : data, picname : picname },
			success : function(dt){
			},
			error : function(e){
				//console.log(e);
			}
		});

		if (confirm('이미지를 페이스북에 업로드 하시겠습니까?')){
			$.ajax({
				type : 'post',
				url :  'http://arcray.dothome.co.kr/upload/imgupload.php',
				async : false,
				data : { mode:'add', pid : profileid, durl : data },
				success : function(dt){
					uploadphoto('http://arcray.dothome.co.kr/upload/' + dt + '.png', picname);
				},
				error : function(e){
					//console.log(e);
				}
			});
		}
	}
	
	
}
function uploadphoto(url, picname){
    var imgURL = url;

    FB.api('/me/photos', 'post', {
        message: username + '님의 '+picname+' 그림입니다.',
        url:imgURL        
    }, function(response){
        if (!response || response.error) {
            alert('Error occured');
        } else {
            alert('포스트에 등록되었습니다.');
        }
    });
}

$(function() {
	/*## JQuery Version ##*/
 
	/* Compatibility Tested ~
	   IE6 - true
	   IE7 - true
	   IE8 - true
	   Chrome 5 + 6 - true
	   Safari(pc) 4.0.x - true
	   Firefox 3.6.x - true
	   Opera 10.53 - false
	*/
	/* References + Notes ~
	 * window.onbeforeunload is an event that fires prior to the unload event when the page is unloaded
	 * MSDN Reference : http://msdn.microsoft.com/en-us/library/ms536907(VS.85).aspx
	 * Moz Reference : https://developer.mozilla.org/en/DOM/window.onbeforeunload
	 * This Event came out in IE4 and isnt in a public specification
	 */
 
	//Bit Of Cross Browser Smashing
	try{
		// http://www.opera.com/support/kb/view/827/
		opera.setOverrideHistoryNavigationMode('compatible');
		history.navigationMode = 'compatible';
	}catch(e){}
 
	//Our Where The F' Are You Going Message
	function ReturnMessage()
	{
		return updateUserDate();
	}
 
	//UnBind Function
	function UnBindWindow()
	{
		$(window).unbind('beforeunload', ReturnMessage);
	}
 
	//Bind Links we dont want to affect
	//$('#homebtn').bind('click', UnBindWindow); 
	//$('#googlebtn').bind('click', UnBindWindow); 
 
	//Bind Exit Message Dialogue
	$(window).bind('beforeunload', ReturnMessage);
 
});