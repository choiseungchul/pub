var Browser = {
	a : navigator.userAgent.toLowerCase()
}

Browser = {
	ie : /* @cc_on true || @ */false,
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

var ctrlDown = false;
var ctrlKey = 17, vKey = 86, cKey = 67, yKey = 89, zKey = 90;

function SetCookie(name, value, expiredays) {
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
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

function addArrayUnique(arr, el){
	if(arr.indexOf(el) == -1){
		arr.push(el);
	}
	return arr.length;
}

function removeArrayUnique(arr,el){
	var idx = -1;
	for(var i = 0 ; i <arr.length ;i++){
		if(arr.indexOf(el) != -1){
			idx = i;
			break;
		}
	}
	if(idx != -1) arr.splice(idx,1);
}

function leaveroom(){
	window.close();
}

function updateUserDate(){
	$.ajax({
		url : 'http://arcray.dothome.co.kr/scminddev/reciever/user.php',
		data : { mode : 'update', pid : profileid },
		dataType : 'html',
		type :'POST',
		error : function(e){
			//console.log(e);
			return;
		},
		success: function(data) {
		}
	});	

	return '저장된 모든 정보가 삭제됩니다\n나가시겠습니까?';
}


$('.wrap').corner();
$('.roomlist_cont').corner();
$('.chat_out').corner();
$('#chatInput_global').corner();
$('.totaluser').corner();
$('.gamebtn span').corner();
$('.myinfo_menu').corner();
$('.myinfo_layer').corner();
$('.savepng_btn span').corner();
$('.clearbtn span').corner();
$('.roomout_btn span').corner();
$('.userlist_mypage').corner();
$('.pallet span').corner();
$('.msgcont').corner();
$('#chatInput').corner();
$('.timer').corner();
$('.room_box').corner();
$('.intoroom_btn').corner();
$('.userlist').corner();
$('.makeroom_input').corner();
$('.roomname_input').corner();
$('span.gamebtn1').corner();
$('.wrap_game').corner();