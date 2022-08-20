
var WaitingForResponse = false;
var Success = false;
var DontClickButton = false;


function OnLoginButtonClick(){
	let id = $('#id-input');
	let pw = $('#pw-input');
	let pw2 = $('#pw-again');
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
	else if($(pw2).val() == "" || $(pw).val() != $(pw2).val()){
		$(pw2).next('label').addClass('warning');
		setTimeout(function(){
			$('label').removeClass('warning')
		}, 1500);
	}
	else{

		if(WaitingForResponse || DontClickButton){
			return;
		}
		btn.text("Waiting ...");
		WaitingForResponse = true;

		Waiting();

		var url = "http://127.0.0.1:8000/register/" + $('#id-input').val() + "/" + $('#pw-input').val();
		SendLoginRequest(url);
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

function SendLoginRequest(theUrl)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, true);

	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			if(xmlHttp.responseText == 'true'){
				Success = true;
				RegisterSuccess();
			}else{
				Success = false;
				RegisterFail();
			}
			WaitingForResponse = false;
		}
	}

	xmlHttp.send( null );
	setTimeout(function(){
		if(WaitingForResponse)
		{
			RegisterFail();
		}
	}, 5000);		
}

function RegisterFail()
{
	WaitingForResponse = false;
	let topmsg = $('#top');
	let btn = $('#btn');

	btn.text("REGISTER");
	topmsg.text("REGISTER FAIL!");

	setTimeout(function(){
		topmsg.text("REGISTER");
	}, 1000);
}

function RegisterSuccess()
{
	DontClickButton = true;
	let topmsg = $('#top');
	let btn = $('#btn');

	btn.text("REGISTER SUCCESS");
	topmsg.text("REGISTER SUCCESS!");

	setTimeout(function(){
		var link = "login.html";
		location.href = link;
		location.replace(link);
		window.open(link);
	}, 2000);
}