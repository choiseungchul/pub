
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
var profileid = -1;

var c_width = 720;
var c_height = 480;

var drawCache = new Array();
var mydraw = new Array();
var drawPoint = 0;

var socket;


$(document).ready(function(){

	$.modal("<img src='/img/ajax-loader.gif'>", { opacity : 60 });

	draw = document.getElementById("drawimg").getContext("2d");
	draw.strokeWidth = strokeWidth;
	draw.strokeStyle = color;	
	draw.lineCap = 'round';

	if(Browser.chrome){
	}else if(Browser.firefox){
	}else if(Browser.opera){
	}else if(Browser.ie9){
	}else if(Browser.safari){
	}else if(Browser.safari3){
	}else{
		alert('해당 브라우저는 게임을 지원하지 않습니다.');
		location.href='/index.html';		
	}
});

function showCvSize(){
	showlayer($('.canvas_change'));
}

function closeCv(){
	$('.canvas_change').hide();
}

// 팝업띄우는 스크립트
function showlayer(obj){
	
	var winH = $(window).height();
	var winW = $(window).width();
	      
	obj.css('top',  winH/2-obj.height()/2);
	obj.css('left', winW/2-obj.width()/2);

	obj.show();
}

function init(){
	drawEventAdd();

	socket = io.connect();

	socket.on('randomtxt', function(data){
		if(	data.msg ){
			$('.rantxt').text('랜덤 단어: ' + data.msg);
		}
	});

}

function CanvasSizeSet(){
	document.getElementById("drawimg").setAttribute('width', $('#c_width').val());
	document.getElementById("drawimg").setAttribute('height',$('#c_height').val());
}

function clearCanvas(){
	draw.clearRect(0,0,c_width,c_height);
}

function reDraw(){
	if(mydraw.length == 0 || mydraw.length < drawPoint+1) return;
	draw.clearRect(0,0,c_width,c_height);
	
	for (var i=0;i<drawPoint+1 ;i++ )
	{
		if(mydraw[i].length > 0){
			draw.beginPath(mydraw[i][0]['x'], mydraw[i][0]['y']);

			for (var k=1;k<mydraw[i].length;k++ )
			{
				var x = mydraw[i][k]['x'];
				var y = mydraw[i][k]['y'];
				var w = mydraw[i][k]['width'];
				var c = mydraw[i][k]['color'];

				draw.strokeStyle = c;
				draw.lineWidth = w;
				
				draw.lineTo(x,y);
				
				draw.stroke();
			}
			draw.closePath();
		}
	}
	
	drawPoint++;

	
}
function undoDraw(){
	if(mydraw.length == 1 || mydraw.length == 0) return;
	draw.clearRect(0,0,c_width,c_height);

	for (var i=0;i<drawPoint-1 ;i++ )
	{
		if(mydraw[i].length > 0){
			draw.beginPath(mydraw[i][0]['x'], mydraw[i][0]['y']);

			for (var k=1;k<mydraw[i].length;k++ )
			{
				var x = mydraw[i][k]['x'];
				var y = mydraw[i][k]['y'];
				var w = mydraw[i][k]['width'];
				var c = mydraw[i][k]['color'];

				draw.strokeStyle = c;
				draw.lineWidth = w;
				
				draw.lineTo(x,y);
				
				draw.stroke();
			}

			draw.closePath();
		}
		
	}
	
	drawPoint--;
	
}

function drawEventAdd(){
	
	// ctrl+z ctrl+y 기능추가
    $(document).keydown(function(e){
        if (e.keyCode == ctrlKey) ctrlDown = true;
    }).keyup(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = false;
    });

    $(document).keydown(function(e){
        if (ctrlDown && e.keyCode == zKey){
			undoDraw();
		}
		if (ctrlDown && e.keyCode == yKey){
			reDraw();
		}
    });

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
		var isMove = false;
		$('#drawimg').mousedown(function(e){
			drawStart = true;
			var _x = Math.floor( e.pageX - $(this).offset().left );
			var _y = Math.floor( e.pageY - $(this).offset().top );
			
			draw.beginPath(_x, _y);
			draw.strokeStyle = color;
			draw.lineWidth = strokeWidth;

			mydraw = mydraw.splice(0, drawPoint);

			drawCache.push({ x : _x, y : _y, width : draw.lineWidth, color : color });
		});
		
		$('#drawimg').mousemove(function(e){
			if (drawStart){
				var _x = Math.floor( e.pageX - $(this).offset().left );
				var _y = Math.floor( e.pageY - $(this).offset().top );
				
				draw.lineTo(_x, _y);
			
				draw.stroke();

				drawCache.push({ x : _x, y : _y, width : draw.lineWidth, color : color });
				isMove = true;
			}
		});
		
		$('#drawimg').mouseup(function(e){

			var _x = Math.floor( e.pageX - $(this).offset().left );
			var _y = Math.floor( e.pageY - $(this).offset().top );

			drawStart = false;
			if(!isMove){
				draw.arc(_x, _y, (draw.lineWidth/4) , 0, Math.PI*2, false);
				draw.fillStyle = color;
				draw.fill();
				draw.stroke();
			}

			draw.closePath();
			mydraw.push(drawCache);
			drawCache = new Array();
			drawPoint++;
			
		});
		
		$('#drawimg').mouseleave(function(e){
			drawStart = false;
			mydraw.push(drawCache);
			drawCache = new Array();
			drawPoint++;
		});
	}else{
		$('#drawimg').touchstart(function(e){
			drawStart = true;
			var _x = Math.floor( e.pageX - $(this).offset().left );
			var _y = Math.floor( e.pageY - $(this).offset().top );
			
			draw.beginPath(_x, _y);
			draw.strokeStyle = color;
			draw.lineWidth = strokeWidth;

			mydraw = mydraw.splice(0, drawPoint);

			drawCache.push({ x : _x, y : _y, width : draw.lineWidth, color : color });
		});
		
		$('#drawimg').touchmove(function(e){
			if (drawStart){
				var _x = Math.floor( e.pageX - $(this).offset().left );
				var _y = Math.floor( e.pageY - $(this).offset().top );
				
				draw.lineTo(_x, _y);
			
				draw.stroke();

				drawCache.push({ x : _x, y : _y, width : draw.lineWidth, color : color });
			}
		});
		
		$('#drawimg').touchend(function(e){
			drawStart = false;
			draw.closePath();
			mydraw.push(drawCache);
			drawCache = new Array();
			drawPoint++;
		});
	}
	
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
	    	       
				   profileid = id;
	    	       username = name;
	    	       mypic = pic_s;
				   email = email;
	    	       $('.userpicture').attr('src', pic_s);
				   $('.user_name').text(name);
	    	    }
		    	
		    	init();

				$.modal.close();
			}
		); 
	});
}

function saveDrawing() {

	var canvas = document.getElementById("drawimg");
	var data;

	var picname = window.prompt('이미지의 제목을 입력해주세요','');

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
	}else{
		alert('이미지제목을 입력하세요');
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

function createtxt(){
	socket.emit('randomtxt', {});
}