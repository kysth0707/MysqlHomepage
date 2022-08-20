// alert( document.cookie );
// setCookie("a", "a", 1);
// console.log( document.cookie );

var WaitingForResponse = false;
var Success = false;
var ID;
var DontClickButton = false;


function OnLoginButtonClick(){
	let id = $('#id-input');
	let pw = $('#pw-input');
	let btn = $('#btn');

	if($(id).val() == ""){
		$(id).next('label').addClass('warning');
		setTimeout(function(){
			$('label').removeClass('warning')
		}, 1500);
	}
	else if($(pw).val() == ""){
		$(pw).next('label').addClass('warning');
		setTimeout(function(){
			$('label').removeClass('warning')
		}, 1500);
	}
	else{
		ID = $('#id-input').val();
		if(WaitingForResponse || DontClickButton){
			return;
		}
		btn.text("Waiting ...");
		WaitingForResponse = true;
		DontClickButton = true;

		Waiting();

		var url = "http://127.0.0.1:8000/login/" + $('#id-input').val() + "/" + $('#pw-input').val();
		SendLoginRequest(url, $('#id-input').val(), $('#pw-input').val());
	}
}

function Waiting()
{
	if(!WaitingForResponse) {return;}
	let btn = $('#btn');

	if(btn.text() == "Waiting .") {btn.text("Waiting ..");}
	else if(btn.text() == "Waiting ..") {btn.text("Waiting ...");}
	else {btn.text("Waiting .");}

	setTimeout(Waiting, 400);
	
}

function SendLoginRequest(theUrl, ID, PW)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, true);

	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			if(xmlHttp.responseText == 'true'){
				Success = true;
				LoginSuccess(ID, PW);
			}else{
				Success = false;
				LoginFail();
			}
			WaitingForResponse = false;
		}
	}

	xmlHttp.send( null );
	setTimeout(function(){
		if(WaitingForResponse)
		{
			LoginFail();
		}
	}, 5000);		
}

function LoginFail()
{
	DontClickButton = false;
	WaitingForResponse = false;
	let topmsg = $('#top');
	let btn = $('#btn');

	btn.text("LOGIN");
	topmsg.text("LOGIN FAIL!");

	setTimeout(function(){
		topmsg.text("LOGIN");
	}, 1000);
}

function LoginSuccess(ID, PW)
{
	let topmsg = $('#top');
	let btn = $('#btn');

	setCookie("ID", ID, 1);
	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://127.0.0.1:8000/refreshtoken/" + ID + "/" + PW
	xmlHttp.open( "GET", theUrl, true);


	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			if(xmlHttp.responseText != 'false'){
				setCookie("token", xmlHttp.responseText, 1);
				Success = true;
				var link = "success.html";
				location.href = link;
				location.replace(link);
				window.open(link);
			}else{
				Success = false;
				DontClickButton = false;
				btn.text("LOGIN");
				topmsg.text("LOGIN");
			}
			WaitingForResponse = false;
		}
	}

	xmlHttp.send( null );
}