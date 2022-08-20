function LogOut()
{
	delCookie("ID");
	delCookie("token");
	window.location.reload();
}