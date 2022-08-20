function IsLoginSuccess()
{

	var token = getCookie("token");
	if(typeof(token) == 'undefined'){return false;}

	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://127.0.0.1:8000/comparetoken/" + getCookie("ID") + "/" + token;
	xmlHttp.open( "GET", theUrl, true);


	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			if(xmlHttp.responseText == 'true')
			{
				console.log("예");
				$('#acc').text("내 계정 : "+getCookie("ID"));
			}
		}
	}

	xmlHttp.send( null );
}

IsLoginSuccess();