

TokenSuccess = false;

function RefreshTokenReuqest(ID, Password)
{
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "", true);

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
			TokenSuccess = true;
		}
	}

	xmlHttp.send( null );
	setTimeout(function(){
		if(WaitingForResponse)
		{
			TokenSuccess = false;
		}
	}, 5000);		
}