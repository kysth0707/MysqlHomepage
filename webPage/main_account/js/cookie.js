function setCookie(cName, cValue, cDay){
	var expire = new Date();
	expire.setDate(expire.getDate() + cDay);
	cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
	if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
	cookies += 'domain = 192.168.68.116;'
	document.cookie = cookies;
}
	

function getCookie(cookie_name) {
	var x, y;
	var val = document.cookie.split(';');

	for (var i = 0; i < val.length; i++) {
		x = val[i].substr(0, val[i].indexOf('='));
		y = val[i].substr(val[i].indexOf('=') + 1);
		x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
		if (x == cookie_name) {
			return unescape(y); // unescape로 디코딩 후 값 리턴
		}
	}
}

function delCookie(cname)
{
	// 쿠키 삭제는? 이미 한참 지나간 시간을 입력해버림으로써 쿠키를 삭제시킨다.
	// document.cookie = 'user-id=; expires=Sat, 01 Jan 1972 00:00:00 GMT'

	// console.log(cname);
	setCookie(cname, '', 0);
}
