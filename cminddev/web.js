var async   = require('async');
var express = require('express');
var util    = require('util');
var sio     = require('socket.io');
var fs		= require('fs');

var dbdomain = 'http://arcray.dothome.co.kr';
var appdomain = 'http://scminddev.cafe24app.com';

// read file word_kor.txt
fs.readFile( __dirname + '/word_kor.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var str = data.split('\n');
  
  for ( var i = 1 ; i < str.length ; i++ ){
	  txt.push(str[i]);
  }
});

var app = express.createServer(
  //express.logger(),
  express.static(__dirname + '/public'),
  express.bodyParser(),
  express.cookieParser(),
  
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'secret123' })
);

app.configure(function () {
    app.use(express.methodOverride());
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", appdomain);
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
    app.use(app.router);
});

var io = sio.listen(app);

io.set('log level', 1);

io.configure( function() {
    io.set('close timeout', 60*30); // 30m time out
});

var rooms = new Array(0);			// 방정보
var users = new Array(0);			// 사용자 정보
var userpics = new Array(0);		// 사용자 이미지
var usersocket = new Array(0);		// 사용자 소켓아이디
var obs = new Array(0);				// 옵저버 정보
var masters = new Array(0);			// 방장 정보
var draws = new Array(0);			// 그림 정보
var txt = new Array(0);				// 문제단어

var gameroof = 3;					// 게임 로테이션 횟수

io.sockets.on('connection', function (socket) {

	var address = socket.handshake.address;

	console.log("New connection from " + address.address + ":" + address.port);

	setInterval(function(){
		var usercnt=0,i;
		for(i in io.sockets.sockets) usercnt++;
		
		socket.emit('usercnt', usercnt);
	} , 2000);

	if (rooms.length > 0){
		socket.emit('viewrooms', {rooms : rooms, users : users});
	}
	
	if (users.length > 0){
		socket.emit('viewusers', {users : users, pics : userpics});
	}
	
	socket.on('intoglobal', function(data){		
		socket.join('readyuser');
	});
	
	socket.on('adduser', function(data){
		allusers.push(data.username);
	});
	  
	socket.on('removeuser', function(data){
		var index = allusers.indexOf(data.username);
		allusers.splice(index,1);
	});
	  
	socket.on('chkanswer', function(data){
		var as = rooms[data.rid-1] != undefined ? rooms[data.rid-1]['answer'] : '';
		  
		if (as == data.answer){
			  
			draws[parseInt(data.rid)-1] = new Array();
			  
			socket.broadcast.to(data.rid).emit('correctas', { username : data.username, answer : data.answer });
			socket.emit('correctas', { username : data.username, answer : data.answer });
			var uname = goNext(socket, data.rid);
			sendQuestion(socket, data.rid, uname);
		}
	});
	  
	socket.on('intoroom', function(data){
		intoroom(data ,socket);
	});
	  
	socket.on('makeroom', function(data){
		makeroom(data, socket);
	});
	  
	socket.on('chatinput', function(data){
		console.log(data);
		socket.emit('bschat', {username : data.username, message : data.message});
		socket.broadcast.to(data.roomid).emit('bschat', {username : data.username, message : data.message});
	});
	  
	socket.on('global_chat', function(data){
		console.log(data);
		//io.sockets.socket(socket.id).emit('globalchat', {username : data.username, message : data.message});
		socket.emit('globalchat', {username : data.username, message : data.message});
		socket.broadcast.to('readyuser').emit('globalchat', {username : data.username, message : data.message});
	});

	socket.on('mouseup', function(data){
		socket.emit('mouseup', data);
		socket.broadcast.to(data.roomid).emit('mouseup', data);
		//draws[parseInt(data.roomid)-1].push(data);
	});
	socket.on('mousemove', function(data){
		socket.emit('mousemove', data);
		socket.broadcast.to(data.roomid).emit('mousemove', data);
		if (draws[parseInt(data.roomid)-1] != undefined)
		draws[parseInt(data.roomid)-1].push(data);
	});
	socket.on('mousedown', function(data){
		socket.emit('mousedown', data);
		socket.broadcast.to(data.roomid).emit('mousedown', data);
		if (draws[parseInt(data.roomid)-1] != undefined)
		draws[parseInt(data.roomid)-1].push(data);
	});

	socket.on('timeoutas', function(data){
		  
		console.log('room ' + data.rid + ' is timeout drawer is = ' + data.username);
		
		draws[parseInt(data.rid)-1] = new Array();
		
		socket.emit('timeoutas', {username : data.username , answer : rooms[data.rid-1]['answer']});
		socket.broadcast.to(data.rid).emit('timeoutas', {username : data.username , answer : rooms[data.rid-1]['answer']});
		var uname = goNext(socket, data.rid);
		sendQuestion(socket, data.rid, uname);
	});
	  
	socket.on('roomchange', function(data){
		rooms[data.id-1]['played'] = data.played;
//		socket.broadcast.emit('roomchange', data);
		console.log('room ' + data.id + ' is change stat = ' + data.played);
	});
	  
	socket.on('clearcanvas', function(data){
		socket.broadcast.to(data.rid).emit('clearcanvas', {});
		socket.emit('clearcanvas', {});
		draws[(data.rid)-1] = new Array();
	});
	  
	socket.on('changeanswer', function(data){
		var answer = txtGen();
		var prev = rooms[data.rid-1]['answer'];
		rooms[data.rid-1]['answer'] = answer;
		  
		socket.broadcast.to(data.rid).emit('reanswer', {answer : answer, username : data.username});
		socket.emit('reanswer', {answer : answer, username : data.username});
		  
		console.log('answer ' + prev + 'is change to ' + answer);
	});
	  
	socket.on('gamestart', function(data){
		gamestart(socket, data.rid);
	});
	  
	socket.on('disconnect', function (data){
		socketIdChk(socket);
	});

	socket.on('randomtxt', function(data){
		socket.emit('randomtxt', { msg : txtGen() });
	});

});

var port = process.env.PORT || 8001;

app.listen(port, function() {
  console.log("Listening on " + port);
});

/*
app.dynamicHelpers({
  'host': function(req, res) {
    return req.headers['host'];
  },
  'scheme': function(req, res) {
    req.headers['x-forwarded-proto'] || 'http'
  },
  'url': function(req, res) {
    return function(path) {
      return app.dynamicViewHelpers.scheme(req, res) + app.dynamicViewHelpers.url_no_scheme(path);
    }
  },
  'url_no_scheme': function(req, res) {
    return function(path) {
      return '://' + app.dynamicViewHelpers.host(req, res) + path;
    }
  },
});*/


function welcome_page(req, res){
	res.writeHead(200,
		{
			'Content-Type': 'text/html', 
			'Access-Control-Allow-Origin': appdomain
			//'Access-Control-Allow-Origin': '*'
		}
	);

	fs.readFile(__dirname + '/public/index.html', 'utf8', function (err,data) {
	  if (err) {
		res.end(err.toString() + '--');
		return console.log(err);
	  }
		res.end(data);
	});
}

function handle_signal(req, res){
	res.writeHead(200,
		{
			'Content-Type': 'text/plain', 
			//'Access-Control-Allow-Origin': dbdomain
			'Access-Control-Allow-Origin': '*'
		}
	);

	var p = req.url.split('&')[0];
	var action = p.split('a=')[1];
	var params = req.url.split('&',2)[1];

	if(action == 'noticeupdate'){
		io.sockets.emit('n_update', {});
		res.end('0');

	}else if(action == 'sendallusers'){

		var msg = params.split('allmsg=')[1];

		io.sockets.emit('adminmsg', { msg : msg });

		res.end('0');
	}
}

function handle_process(req, res){
	res.writeHead(200,
		{
			'Content-Type': 'text/plain', 
			'Access-Control-Allow-Origin': appdomain
			//'Access-Control-Allow-Origin': '*'
		}
	);

	var p = req.url.split('&')[0];
	action = p.split('a=')[1];
	params = req.url.split('&',2)[1];
	
	if(action == 'chkroom'){
		console.log(req.url);
		var rn = params.split('rname=')[1];
		
		rn = decodeURI(rn);
		
		var isExist = false;
		
		for (var i = 0 ; i < rooms.length ; i++){
		  if (rooms[i]['name'] == rn){
		    isExist = true;
		    break;
		  }
		}
		
		if (isExist) res.end('1');
		else res.end('0');
		
	}else if(action == 'roominfouser'){
		
		var rid = params.split('rid=')[1];
		if (users[parseInt(rid)-1] != undefined ) {
			res.end(userpics[parseInt(rid)-1].toString() + ":::" + users[parseInt(rid)-1].toString() + ":::" + masters[parseInt(rid)-1]);
		}else{
			res.end('0');
		}
		
	}else if (action == 'drawinfo'){
		
		var rid = params.split('rid=')[1];
		if (draws[parseInt(rid)-1] != undefined )
		res.end(JSON.stringify(draws[parseInt(rid)-1]));
		else res.end('0');
		
	}else if(action == 'chkuser'){
		
		console.log(req.url);
		
		var p = params.split('riduname=')[1];
		var rid = p.split(':')[0];
		var uname = p.split(':')[1];
		uname = decodeURI(uname);
		
		var usersarr = users[parseInt(rid)-1];
		//console.log(usersarr);
		var flag = false;
		
		if (usersarr.indexOf(uname) != -1){
			res.end('1');
		}else{
			res.end('0');
		}
	}else if(action == 'roominfoall'){
		var rid = params.split('rid=')[1];
		if (rooms[rid-1] != undefined)
		res.end(JSON.stringify(rooms[rid-1]));
		else res.end('0');
	}
}

app.all('/method/',handle_process);
app.all('/signal/',handle_signal);
app.all('/',welcome_page);

app.configure(function () {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(function(req, res, next) {
    	res.header('Access-Control-Allow-Origin', appdomain);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Cache-Control', 'no-cache');
        res.header('Connection', 'keep-alive');
        next();
    });
    app.use(app.router);
});


function gamestart(socket, rid){
	
	rooms[rid-1]['played'] = 1;
	if (users[rid-1] != undefined ){
		if (users[rid-1].length > 1){
			var uname = goNext(socket, rid);
			
			sendQuestion(socket, rid, uname);
		}
	}
}

function sendQuestion(socket, rid, uname){
	var answer = txtGen();
	
	socket.broadcast.to(rid).emit('answer', {answer : answer, username : uname});
	socket.emit('answer', {answer : answer, username : uname});
	rooms[rid-1]['answer'] = answer;
	
	console.log('answer is : ' + answer);
}

function goNext(socket, rid){
	rooms[rid-1]['turn'] += 1;
	var username = '';
	
	if (rooms[rid-1]['turn'] == users[rid-1].length || rooms[rid-1]['turn'] < users[rid-1].length){
		
		username = users[rid-1][rooms[rid-1]['turn']-1];
		socket.broadcast.to(rid).emit('nextuser', {username : username});
		socket.emit('nextuser', {username : username});
		
		console.log('case 1');
		console.log('turn num : ' + rooms[rid-1]['turn']);
		console.log('nextuser is ' + username);
		
	}else if (rooms[rid-1]['turn'] > users[rid-1].length){
		rooms[rid-1]['turn'] = 1;
		rooms[rid-1]['turncnt'] += 1;
		
		console.log('case 2');
		
		if (rooms[rid-1]['turncnt'] < gameroof){
			username = users[rid-1][0];
			socket.broadcast.to(rid).emit('nextuser', {username : username});
			socket.emit('nextuser', {username : username});
			
			console.log('turn num : ' + rooms[rid-1]['turn']);
			console.log('nextuser is ' + username);
		}else{
			socket.broadcast.to(rid).emit('gameend', {});
			socket.emit('gameend', {});
			rooms[rid-1]['turn'] = 0;
			rooms[rid-1]['turncnt'] = 0;
		}  	
	}
	return username;
}

function destroyroom(rid, socket){
	rooms[rid-1]['name'] = '';
	rooms[rid-1]['id'] = -1;
	rooms[rid-1]['master'] = '';
	draws[rid-1] = new Array();
	socket.broadcast.emit('destroyroom', {rid : rid});
}

function socketIdChk(socket){
	var idx = -1;
    
    for (var i = 0 ; i < usersocket.length; i++){
    	
    	if (usersocket[i] != undefined){
    		idx = usersocket[i].indexOf(socket.id);
    	}
    	
    	if (idx != -1){
    		
    		console.log('id : ' + socket.id + ' in room ' + (i+1) + ' disconnected');
    		
    		if (users[i].length == 1){
    		 
    			destroyroom((i+1), socket);
    			 
    		}else if(users[i].length > 1){
    			var user_name = users[i][idx];
    			
    			users[i].splice(idx, 1);
    			userpics[i].splice(idx, 1);
    			usersocket[i].splice(idx, 1);
    			masters[i] = users[i][0];
    			console.log(masters[i] + ' is master');
    			socket.broadcast.to(i+1).emit('leaveuser', {username : user_name });
    		}
    		
    		console.log(rooms);
    		
    		break;
    	}
    }   
}

function intoroom(data, socket){
	if(parseInt(data.id) > rooms.length){
		 
	}else{
		
		var userlength = users[parseInt(data.id)-1].length;
		
		if (data.play == 0 && userlength < 5){
			 
			 if (rooms[parseInt(data.id)-1]['played'] == 0){
				 console.log(data.username + ' is coming room ' + data.id);
				 
				 users[parseInt(data.id)-1].push(data.username);
				 userpics[parseInt(data.id)-1].push(data.pics);
				 usersocket[parseInt(data.id)-1].push(socket.id);
				 
				 console.log(users[parseInt(data.id)-1]);
				 socket.leave('readyuser');
				 socket.join(data.id);
				 socket.broadcast.to(data.id).emit('intouser', {username : data.username, pics : data.pics});
				 socket.emit('intouser', {username : data.username});
			 }
		 }else{
			 console.log(data.username + ' is coming room ' + data.id + ' for observer');
			 socket.leave('readyuser');
			 socket.join(data.id);
			 socket.broadcast.to(data.id).emit('intouserob', {username : data.username});
			 socket.emit('intouserob', {username : data.username});
		 }
	 }
}

function makeroom(data, socket){
	var room = new Object();
	 room.name = decodeURI(data.roomname);
	 room.id = rooms.length+1;
	 room.master = decodeURI(data.username);
	 room.played = 0;
	 room.turn = 0;
	 room.answer = '';
	 room.turncnt = 0;
	 
	 var user = new Array();
	 user.push(data.username);
	 var userpic = new Array();
	 userpic.push(data.pics);
	 
	 var socketarr = new Array();
	 socketarr.push(socket.id);
	 
	 var draw = new Array();
	 draws.push(draw);
	 
	 rooms.push(room);
	 users.push(user);
	 userpics.push(userpic);
	 usersocket.push(socketarr);
	 masters.push(data.username);
	 
	 socket.leave('readyuser');
	 socket.join(rooms.length);
	 
	 console.log(data.username + ' is making room ' + rooms.length);
	 
	 socket.emit('roomismaked' , { rid : rooms.length});
	 
	 socket.broadcast.emit('newroom', {room : room, user : user});
	 
	 console.log(users[parseInt(rooms.length)-1]);
	 console.log(rooms);
}

function txtGen(){
	var idx = Math.floor(Math.random()*txt.length);
	return txt[idx];
}

function init(){
}

setTimeout(function(){
	for(var i = 0 ; i < rooms.length; i++){
		if(rooms[i]['id'] == -1){
			
		}
	}

}, 1000 * 60 * 30)


function randomString(clen) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = clen;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}


