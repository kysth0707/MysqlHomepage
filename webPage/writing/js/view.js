
$( document ).ready(function() {
	var WritingNum = getCookie("Writing");
	
	// console.log(WritingNum);
	LoadContents(WritingNum);
});

function LoadContents(Num)
{
	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://192.168.68.116:8000/writingcontent/" + Num
	xmlHttp.open( "GET", theUrl, true);


	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			var Datas = JSON.parse(this.responseText);
			console.log(Datas);

			$('#Title').text(Datas[0].Title);
			$('#Num').text(Datas[0].Num);
			$('#Writer').text(Datas[0].Writer);
			$('#Date').text(Datas[0].Date);
			$('#Lookup').text(Datas[0].Lookup);
			var Content = JSON.stringify(Datas[0].Content);
			Content.replace("\n","<br>");
			$('#Content').html(Content.substring(1, Content.length - 1));
		}
	}

	xmlHttp.send( null );
}