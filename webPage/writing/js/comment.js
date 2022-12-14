CanButton = true;

function AddComment()
{
	if(!CanButton)
	{
		return;
	}
	if($('#CommentData').val() == "")
	{
		alert("내용을 입력해주세요."); 
		return;
	}
	
	setTimeout(function(){
		if(CanButton == true){return;}
		alert("작성 실패\n사용 가능한 문자만 입력해주세요!");
		CanButton = true;
	}, 1000);

	CanButton = false;
	var WritingNum = getCookie("Writing");
	var Comments = $('#CommentData').val();
	var ID = getCookie("ID");
	var Token = getCookie("token");

	Comments = Comments.replace(/\r\n/gi,"<br>");
	Comments = Comments.replace(/\n/gi,"<br>");
	Comments = encodeURI(Comments);


	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://nojam-homepage.kro.kr:8000/addcomment/"+WritingNum+"/"+ID+"/"+Token+"/"+Comments+"/"
	console.log(theUrl);
	xmlHttp.open( "GET", theUrl, true);

	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			if(this.responseText == "true")
			{
				// alert("작성 성공!");

				window.location.reload();
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


function CreateComment(ID, Comment, Date)
{
	var ParentDIV = document.getElementById("comments");

	var newDIV = document.createElement("h1");
	newDIV.innerHTML = "[ " + ID + " ]" + " - " + Date;
	ParentDIV.appendChild(newDIV);

	var newDIV = document.createElement("h2");
	newDIV.innerHTML = "> " + Comment;
	ParentDIV.appendChild(newDIV);
}

function LoadComments()
{
	var WritingNum = getCookie("Writing");
	// var WritingNum = 0;

	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://nojam-homepage.kro.kr:8000/getcomment/"+WritingNum
	xmlHttp.open( "GET", theUrl, true);

	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			var Datas = JSON.parse(this.responseText);
			// console.log(Datas);
			for(var i = 0; i < Datas.length; i++)
			{
				CreateComment(Datas[i].ID, Datas[i].Comment, Datas[i].Date);
			}
		}
	}

	xmlHttp.send( null );
}


function DeleteWriting()
{
	if(!confirm("정말 삭제하시겠습니까?"))
	{
		return;
	}


	var WritingNum = getCookie("Writing");
	var ID = getCookie("ID");
	var Token = getCookie("token");

	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://nojam-homepage.kro.kr:8000/deletecontent/" + WritingNum +"/"+ ID +"/"+ Token
	xmlHttp.open( "GET", theUrl, true);


	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			console.log(this.responseText);
			if(this.responseText == "true")
			{
				alert("삭제 완료!");
				var link = "http://nojam-homepage.kro.kr:8080/webPage/writing/list.html";
				location.href = link;
				location.replace(link);
				window.open(link);
			}
			else
			{
				alert("삭제 실패!");
			}
		}
	}

	xmlHttp.send( null );
}


$( document ).ready(function() {
	LoadComments();
});