var CanButton = true;

function Write()
{
	if(!CanButton)
	{
		return;
	}
	if($('#Content').val() == "")
	{
		alert("내용을 입력해주세요."); 
		return;
	}
	
	setTimeout(function(){
		if(CanButton == false){return;}
		alert("작성 실패\n사용 가능한 문자만 입력해주세요!");
		CanButton = true;
	}, 1000);

	CanButton = false;
	var Title = $('#Title').val();
	var Content = $('#Content').val();
	var ID = getCookie("ID");
	var Token = getCookie("token");
	Token = Token.substring(1,Token.length - 1);

	Content = Content.replace(/\r\n/gi,"<br>");
	Content = Content.replace(/\n/gi,"<br>");
	Content = encodeURI(Content);


	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://192.168.68.116:8000/addwriting/"+ID+"/"+Token+"/"+Title+"/"+Content+"/"
	xmlHttp.open( "GET", theUrl, true);

	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			if(this.responseText == "true")
			{
				alert("작성 성공!");

				var link = "http://192.168.68.116:8080/webPage/writing/list.html";
				location.href = link;
				location.replace(link);
				window.open(link);
			}
			else
			{
				alert("작성 실패");
				CanButton = true;
			}
		}
	}

	xmlHttp.send( null );

}
