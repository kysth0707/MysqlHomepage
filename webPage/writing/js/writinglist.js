


function WritingList(StartNum, Limit)
{
	var xmlHttp = new XMLHttpRequest();
	var theUrl = "http://nojam-homepage.kro.kr:8000/writings/" + StartNum + "/" + Limit
	xmlHttp.open( "GET", theUrl, true);


	xmlHttp.onreadystatechange = function(){
		if(this.status == 200 && this.readyState == this.DONE)
		{
			var Datas = JSON.parse(this.responseText);
			for(var i = 0; i < Datas.length; i++){
				// AddWriting(Datas[0])
				var Date = JSON.stringify(Datas[i].Date).split(' ')[0];
				Date = Date.substring(1, Date.length);
				AddWriting(Datas[i].Num, Datas[i].Title, Datas[i].Writer, Date, Datas[i].Lookup);
			}
		}
	}

	xmlHttp.send( null );
}

function AddWriting(Number, Title, Writer, Date, Count) {
	var ParentDIV = document.createElement("div");
	var Temp = document.getElementById("top");
	Temp.appendChild(ParentDIV);

	CreateDIV(Number, "num", ParentDIV);
	CreateDIV('<a href="#" onclick = "GotoView('+Number+')">'+Title+'</a>', "title", ParentDIV);
	CreateDIV(Writer, "writer", ParentDIV);
	CreateDIV(Date, "date", ParentDIV);
	CreateDIV(Count, "count", ParentDIV);

	// <div>
	// <div class="num">5</div>
	// <div class="title"><a href="view.html">글 제목이 들어갑니다.</a></div>
	// <div class="writer">김이름</div>
	// <div class="date">2021.1.15</div>
	// <div class="count">33</div>
	// </div>
}

function CreateDIV(text, ClassValue, ParentDIV)
{
	var newDIV = document.createElement("div");
	newDIV.innerHTML = text;
	newDIV.setAttribute("class", ClassValue);
	ParentDIV.appendChild(newDIV);
}


function GotoView(Num)
{
	setCookie("Writing", Num, 1);

	var link = "view.html";
	location.href = link;
	location.replace(link);
	window.open(link);
}


WritingList(0, 100);