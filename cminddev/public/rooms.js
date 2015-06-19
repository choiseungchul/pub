
var wshostname = window.location.protocol + '//' + window.location.host;

var draw;
var drawStart = false;
var socket;
var isMobile = false;
var username = '';
var profileid = '';
var isCorrectBrowser = false;
var locale = '';
var pic_page = 0;
var total_pics = 0;
var gamepop;

var layerGroup = new Array();

$(document).ready(function(){
	$.modal("<img src='/img/ajax-loader.gif'>", { opacity : 60 });

	if(Browser.chrome || Browser.firefox || Browser.opera  ){
		isCorrectBrowser = true;
	}else if(Browser.ie7 || Browser.ie8 || Browser.ie9 ){
		
		isCorrectBrowser = false;
		alert('해당 브라우저는 게임을 지원하지 않습니다.');
	}

	getNoticeList();
});

function init(){

	socket = io.connect();
	
	socket.emit('intoglobal', { });   
	
	socket.on('viewrooms', function(data){
		
		for (var i = 0 ; i < data.rooms.length ; i++ ){
			
			if (data.rooms[i] != undefined && data.users[i] != undefined){
				
				var o = data.rooms[i];
				var user = data.users[i];
				
				if (o.id != '-1'){
					if (o.played == 0){
						var newroom = "<div class=\"room_box\" id=\"croom"+o.id+"\"><div class=\"roominfo\" onclick=\"intoroom("+o.id+", 0)\"><p class=\"room_name\">"+o.name+"</p><p class=\"room_member\">"+user.length+" / 5</p></div><div class=\"intoroom_btn\"><a onclick=\"intoroom("+o.id+",0)\">입장</a></div></div>";
						$('.roomlist_cont').append($(newroom));
						$('.room_box').corner();
						$('.intoroom_btn').corner();
					}else if (o.played == 1){
						var newroom = "<div class=\"room_box\" id=\"croom"+o.id+"\"><div class=\"roominfo\" onclick=\"intoroom("+o.id+", 1)\"><p class=\"room_name\">"+o.name+"</p><p class=\"room_member\">"+user.length+" / 5</p></div><div class=\"intoroom_btn\"><a onclick=\"intoroom("+o.id+",1)\">게임중</a></div></div>";
						$('.roomlist_cont').append($(newroom));
						$('.room_box').corner();
						$('.intoroom_btn').corner();
					}
				}
			}
		}
		
		if (data.rooms.length == 0){
			$('.roomlist_cont').html('<h4>생성된 방이 없습니다.</h4>');
		}
	});
	
	socket.on('viewusers', function(data){
		for (var i = 0 ; i < data.users.length ; i++ ){
			
			if (data.users[i] != undefined ){
				
				var user = data.users[i];
				var pics = data.pics[i];
				
			}
		}
	});
	
	socket.on('usercnt', function(data){
		$('.totaluser').text('접속자 : ' + data + ' 명');
	});

	socket.on('newroom', function(data){
		var room = data.room;
		var user = data.user;
		
		var newroom = "<div class=\"room_box\" id=\"croom"+room.id+"\"><div class=\"roominfo\" onclick=\"intoroom("+room.id+", 0)\"><p class=\"room_name\">"+room.name+"</p><p class=\"room_member\">"+user.length+" / 5</p></div><div class=\"intoroom_btn\"><a onclick=\"intoroom("+room.id+",0)\">입장</a></div></div>";
		$('.roomlist_cont').append($(newroom));
	});
	
	socket.on('roomchange', function(data){
		var rid = data.id;
		var played = data.played;
		var name = data.name;
		
		$('#croom' + rid + ' .intoroom_btn').empty();
		if (data.played == 0)
			$('#croom' + rid + ' .intoroom_btn').append($("<a onclick=\"intoroom("+o.id+",0)\">입장</a>"));
		else if (data.played == 1)
			$('#croom' + rid + ' .intoroom_btn').append($("<a onclick=\"intoroom("+o.id+",1)\">게임중</a>"));
	});
	
	socket.on('destroyroom', function(data){
		var rid = data.rid;
		$('#croom' + rid).remove();
	});
	
	$('#chatInput_global').keydown(function(e){
		if (e.which === 13) {
			if ($(this).val() != '' ){
				socket.emit('global_chat', { username : username,  message : $(this).val()});
				$(this).val('');
			}
		}
	});
	
	socket.on('globalchat', function(data){
		printChatMsg(data.username + ": " + data.message);
	});

	socket.on('n_update', function(data){
		getNoticeList();
	});

	socket.on('adminmsg', function(data){
		alert(decodeURI(data.msg));
	});
}

function intoroom(rid, play){
	if(isCorrectBrowser){
		$.ajax({
			url :  wshostname + '/method/?a=chkuser&riduname=' + rid + ":" + encodeURIComponent(username),
			method : 'post',
			async : false,
			success : function(dt){
//				//console.log(dt);
				if (play == 0){
					gamepop = window.open('catchmind.html?id=' + rid + '&p=0', 'gameroom','width=1074,height=938,menubar=no,location=no');
				}else if (play == 1){
					gamepop = window.open('catchmind.html?id=' + rid + '&p=1', 'gameroom','width=1074,height=938,menubar=no,location=no');
				}
			}
		});
	}
}

function makeroom(){
	if(isCorrectBrowser){
		var rn = $('.roomname_input').val();
		if (rn == '') {
			alert('방이름을 입력하세요.');
			return;
		}
		if (rn != ''){
			rn = encodeURIComponent(rn);
			$.ajax({
				url : wshostname + '/method/?a=chkroom&rname=' + rn,
				method : 'post',
				async : false,
				success : function(dt){
					//console.log(dt);
					if (dt == '0'){
						$('.makeroom_input').hide();
						gamepop = window.open('catchmind.html?rid=-1&rname=' + rn, 'gameroom','width=1074,height=938,menubar=no,location=no');
					}else if (dt == '1'){
						alert('중복된 이름의 방이 있습니다');
					}
				}
			});
		}
	}
}

function viewMakeRoom(){
	if(isCorrectBrowser)
	$('.makeroom_input').show();
	$('#roomname_input').focus();
	addArrayUnique(layerGroup,'makeroom_input');
}

function cancelmakeroom(){
	$('.makeroom_input').hide();
	removeArrayUnique(layerGroup,'makeroom_input');
}



function printChatMsg(msg){
	$('.chat_out').append($('<p class="chatmsg"/>').text(msg));
	$('.chat_out').scrollTop($('.chat_out p').size()*24 + 100);
}
// 컨텍스트 메뉴 이벤트 추가
function setMyInfoContextMenus(){

	$('.myinfo').bind('contextmenu', function(e){
		e.preventDefault();
		$('.myinfo_menu').show();
		var myinfo_pos = $('.myinfo').position();
		$('.myinfo_menu').css('margin-left',(e.pageX - myinfo_pos.left ) + 'px');
		$('.myinfo_menu').css('margin-top',(e.pageY - myinfo_pos.top ) + 'px');

		addArrayUnique(layerGroup,'myinfo_menu');
	});

	$('.my_draw span').live('contextmenu', function(e){
		e.preventDefault();

		$('.draw_context').show();
		var myinfo_pos = $('.myinfo_layer').position();
		$('.draw_context').css('margin-left',(e.pageX - myinfo_pos.left - 20 ) + 'px');
		$('.draw_context').css('margin-top',(e.pageY - myinfo_pos.top - 20 ) + 'px');

		$('#draw_idx').val($($(this).find('img')[0]).attr('idx'));
		$('#draw_name').val($($(this).find('strong')[0]).text());
		$('#draw_src').val($($(this).find('img')[0]).attr('src').replace('data:image/png;base64,',''));

		addArrayUnique(layerGroup,'draw_context');
	});

	$(window).keydown(function(e){
		if (e.which == 27){
			var latestLayer = layerGroup.pop();
			$('.'+latestLayer).hide();
		}
	});
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

	FB.Canvas.setAutoGrow();

    function handleUserStateChange(response) {
  		//alert(response.status);
	  if (!response.authResponse) {
	  		var redirect_uri = 'http://scminddev.cafe24app.com/a.html';
	  		var scope = 'publish_stream,user_about_me,email,user_birthday,friends_about_me,friends_photos,user_location';
	        top.location.href = 'https://graph.facebook.com/oauth/authorize?client_id='+appid+'&scope='+scope+'&redirect_uri=' + redirect_uri;
	        
      } else {
  	 		uid = response.authResponse.userID;
			accessToken = response.authResponse.accessToken;

			getMyInfo();
  	  }
    }
  
  };

function getMyInfo(){
	var uid = '';
		FB.api('/me', function(res){
			uid = res.id;
			FB.api( 
		    {
		    	method: 'fql.query', 
		    	query: 'select uid,name,email,pic_square, pic, locale from user where uid  = "' + uid + '"'
		    },
			function(response) {
		    	for(var i=0; i < response.length; i++){
	    	       var id = response[i].uid; //유저아이디
	    	       var pic_s = response[i].pic_square; // 작은사진
	    	       var name = response[i].name; // 이름
	    	       var email = response[i].email; // 이메일주소
				   var locale = response[i].current_location;
	    	       
	    	       $('.mypicture').append($('<img />').attr('src', pic_s));
	    	       
	    	       $('.myname').text(name);
	    	       
	    	       username = name;
	    	       profileid = id;

	    	       $('#chatInput_global').removeAttr('disabled');
	    	       
				   //console.log(response);

	    	       init();

					setId(); // DB에 저장

					myPicCount();
					
					setMyInfoContextMenus();

					$.modal.close();
	    	    }
			}
		); 
	});
}
//Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));


function setId(){
	$.ajax({
		url : 'http://arcray.dothome.co.kr/scminddev/reciever/user.php',
		data : { mode : 'add', pid : profileid, name: username },
		dataType : 'html',
		type :'POST',
		error : function(e){
			//console.log(e);
			return;
		},
		success: function(data) {
			
			if( data == '0'){

			}else if (data =='1')
			{
				alert('웹 캐치마인드 에 오신걸 환영합니다');
			}else if( data =='2'){
				alert('해당 아이디는 정지되었습니다.');
				$('.wrap').empty();
			}
		}
	});		
}

function getNoticeList(){
	
	$.ajax({
		url : 'http://arcray.dothome.co.kr/scminddev/reciever/notice.php',
		data : { mode : 'list' },
		dataType : 'html',
		type :'POST',
		error:function(xhr, status, errorThrown) { 
            alert(errorThrown+'\n'+status+'\n'+xhr.statusText); 
        }, 
		success: function(data) {

			$('.notice').empty();
			$('.notice').html(data);
		}
	});
}

function viewNotice(idx){
	$.ajax({
		url : 'http://arcray.dothome.co.kr/scminddev/reciever/notice.php',
		data : { mode : 'view', idx : idx },
		dataType : 'html',
		type :'POST',
		error : function(e){
			//console.log(e);
			return;
		},
		success: function(data) {
			var obj = $.parseJSON(data);
				obj = obj['notice'];
				
				$('.n_title').html( obj.title );
				$('.n_content').html( obj.content );
				showlayer($('.notice_layer'));

				addArrayUnique(layerGroup,'notice_layer');
		}
	});
}

function n_close(){
	$('.notice_layer').hide();
}

// 팝업띄우는 스크립트
function showlayer(obj){
	
	var winH = $(window).height();
	var winW = $(window).width();
	      
	obj.css('top',  winH/2-obj.height()/2);
	obj.css('left', winW/2-obj.width()/2);

	obj.show();

	addArrayUnique(layerGroup,obj.attr('class'));
}

function showMyInfo(){

}

function showMyDraw(){
	
	// 내정보창 닫기
	closeMyInfo();

	$.ajax({
		url : 'http://arcray.dothome.co.kr/scminddev/reciever/pics.php',
		data : { mode : 'list', st : pic_page*9 , pid: profileid },
		dataType : 'html',
		type :'POST',
		error : function(e){
			//console.log(e);
			return;
		},
		success: function(data) {
			if (data == '-1'){
				alert('데이터가 없습니다.');
			}else{
				var obj = $.parseJSON(data);
				//obj = obj['pic'];
				//console.log(obj);

				var html = '';

				for( var i = 0 ; i < obj.length ; i++ ){
					var pname = obj[i]['picname'];
					var durl = obj[i]['durl'];
					var idx = obj[i]['idx'];

					html += '<span><strong>'+pname+'</strong><br/><img onclick="imgrender(this);" src="data:image/png;base64,'+durl+'" width="180" height="120" idx="'+idx+'"></span>';

				}
				
				$('.my_draw').empty();
				$('.my_draw').html(html);

				showlayer($('.myinfo_layer'));
			}
			
		}
	});		
}

function myPicCount(){

	$.ajax({
		url : 'http://arcray.dothome.co.kr/scminddev/reciever/pics.php',
		data : { mode : 'count', pid: profileid },
		dataType : 'html',
		type :'POST',
		error : function(e){
			//console.log(e);
			return;
		},
		success: function(data) {
			total_pics = parseInt(data);
		}
	});	
}

function closeMyInfo(){
	$('.myinfo_menu').hide();
	removeArrayUnique(layerGroup,'myinfo_menu');
}
function my_close(){
	$('.myinfo_layer').hide();
	removeArrayUnique(layerGroup,'myinfo_layer');
}
function my_draw_close(){
	$('.draw_context').hide();
	removeArrayUnique(layerGroup,'draw_context');
}

$(function(){
	$('.imgRender_cont').click(function(){
		$('#rendering').attr('src','');
		$('.imgRender_cont').hide();

		removeArrayUnique(layerGroup,'imgRender_cont');
	});
});

function imgrender(obj){
	var data = $(obj).attr('src');

	$('#rendering').attr('src',data);

	$('#rendering').load(function(){
		var winH = $(window).height();
		var winW = $(window).width();
		      
		$('.imgRender_cont').css('top',  winH/2-$('.imgRender_cont').height()/2);
		$('.imgRender_cont').css('left', winW/2-$('.imgRender_cont').width()/2);

		$('.imgRender_cont').show();
		addArrayUnique(layerGroup,'imgRender_cont');
	});
}

function pic_prev(){
	if((pic_page-1) == 0 || (pic_page-1) > 0 ){
		pic_page -= 1;
		showMyDraw();
	}else{
		alert('더이상없음');
	}
}

function pic_next(){
	if((pic_page+1) < (total_pics/9) || (pic_page+1) == (total_pics/9)){
		pic_page += 1;
		showMyDraw();
	}else{
		alert('더이상없음');
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


function del_pic(){
	if(confirm('삭제 하시겠습니까?')){
		$.ajax({
			url : 'http://arcray.dothome.co.kr/scminddev/reciever/pics.php',
			data : { mode : 'delete', idx : $('#draw_idx').val() },
			dataType : 'html',
			type :'POST',
			error : function(e){
				//console.log(e);
				return;
			},
			success: function(data) {
				showMyDraw();
				myPicCount();
				my_draw_close();
			}
		});
	}
}

function post_fb(){
	if (confirm('이미지를 페이스북에 업로드 하시겠습니까?')){
		$.ajax({
			type : 'post',
			url :  'http://arcray.dothome.co.kr/upload/imgupload.php',
			async : false,
			data : { mode:'add', pid : profileid, durl : $('#draw_src').val() },
			success : function(dt){
				uploadphoto('http://arcray.dothome.co.kr/upload/' + dt + '.png', $('#draw_name').val());
				my_draw_close();
			},
			error : function(e){
				//console.log(e);
			}
		});
	}
}