
function CheckNow()
{
	let today = new Date();
	$('#now').text("현재 시간 : " + today.toLocaleString());
	setTimeout(CheckNow, 1000);
}

CheckNow();