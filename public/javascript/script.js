function hideNavi(id) {
	var navi = document.getElementById(id);
	if(navi.style.visibility == "hidden")
		navi.style.visibility = "visible";
	else
		navi.style.visibility = "hidden";
}

function changeTableStyle(common_id){
	i = 0;
	do
	{
		id = common_id + "_" + i;
		t = document.getElementById(id)

		if( t == null )	break;

		t = t.getElementsByTagName("table");
		
		for(var j=0;j<t.length;j++)
		{
			if(t[j].className == "table table-striped table-dark")
				t[j].className = "table table-striped table-hover";
			else
				t[j].className = "table table-striped table-dark";
		}

		i++;
	}while(t != null);
}

function getCookie(name){
	//console.log(document.cookie);
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value? value[2] : null;
}
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

$(function(){
//$(document).ready(function(){
	
	//var class = "{{cur}}";
	//alert(class);

	$("#login").click(function(){
		$("#login_popup").slideToggle();
	});

	$("#register").click(function(){
		$("#register_popup").slideToggle();
	});

	$("#LoginBtn").click(function(){
		var formData = $("#LoginForm").serialize();
		//var c = getCookie(login_id);
		$.ajax({
	 		type : "POST",
	 		url : "/user/login",
	 		data : formData,
	 		success : function(res){
	 			if(res.result == "empty"){
	 				alert("Some inputs inputs empty. Please fill all inputs");
	 			}
	 			else if(res.result == "success"){
	 				window.location.reload();
	 			}
	 			else if(res.result == "fail"){
	 				alert("ID or password is wrong!");
	 			}
			}
		});
	});
	$("#RegisterBtn").click(function(){
		var formData = $("#SigninForm").serialize();
		$.ajax({
			type : "POST",
			url : "/user/register",
			data : formData,
			success : function(res){
				if(res.result == "empty"){
					alert("Some inputs is empty. Please fill all inputs");
				}
				else if(res.result == "exist"){
					alert("Exist id! please put another id");
				}
				else if(res.result == "success"){
					window.location.reload();
				}
				console.log(res);
			}
		});
	});
	$("#LogoutBtn").click(function(){
		console.log("------click logout button--------");
		deleteAllCookies();
		window.location.reload();
	});

	$("#GLSBtn").click(function(){
		console.log("------click GLSBtn------");
		//alert(getCookie('usertype'));
		window.location.replace('/gls');
	});

	$("#AddcourseBtn").click(function(){
		var formData = $("#navAddCourseContent").serialize();
		$.ajax({
			type : "POST",
			url : "/admin/addcourse",
			data : formData,
			success : function(res){
				if(res.result == "empty"){
					alert("Some inputs is empty. Please fill all inputs");
				}
				else if(res.result == "exist"){
					alert("There is already that course");
				}
				else if(res.result == "success"){
					var formData1 = $("#navAddCourseContent").serializeArray();
					//alert("formdata : "+formData1);
					var table = document.getElementById("coursetable");
					var row = table.insertRow(-1);
					for (var i=0; i<5; i++){
						var c = row.insertCell(i);
						c.innerHTML = formData1[i].value;
						console.log("formdata["+i+"] : "+formData1[i]);
						c.className='tablec';
					}
					var c = row.insertCell(5);
					c.innerHTML = String(0);
					c.className='tablec';

					document.getElementById("navAddCourseContent").reset();

					$('#navCourseList').addClass('active');
					$('#navCourseListContent').addClass('show');
					$('#navCourseListContent').addClass('active');
					$('#navCourseListContent').show();
					var id = ['navHome','navAddCourse'];
					for(var i=0; i<id.length; i++){
						$('#'+id[i]).removeClass('active');
						$('#'+id[i]+'Content').hide();
						$('#'+id[i]+'Content').removeClass('show');
						$('#'+id[i]+'Content').addClass('hide');
					}
				}
			}
		});
	});


	$('.delbagBtn').on('click', function(){
		var _id = $(this).data('id');
		$.ajax({
			type : "POST",
			url : "/gls/delbag",
			data : {courseid : _id},
			success : function(res){
				if (res.result == "success"){
					//window.location.replace('/gls/delbag');
					var bagtable = document.getElementById("coursebagtable");
					for(var i=0; i<bagtable.rows.length;i++){
						var x = bagtable.rows[i].cells;
						if(x[0].innerHTML==_id) break;
					}
					console.log("i = "+i);
					document.getElementById("coursebagtable").deleteRow(i);

				}
			}
		});
	});

	$('.bagBtn').on('click', function(){
		var _id = $(this).data('id');
		$.ajax({
			type : "POST",
			url : "/sugang/register",
			data : {courseid : _id},
			success : function(res){
				if(res.result == "success"){
					//alert("register success!!!");
					window.location.reload();
				}
				else if(res.result == "full"){
					alert("There is no seat!");
				}
				else if(res.result == "lackcredit"){
					alert("Not enough credits");
				}
				else if(res.result == "exist"){
					alert("already registered!");
				}
			}
		});
	});

	$('.regcancelBtn').on('click', function(){
		var _id = $(this).data('id');
		$.ajax({
			type : "POST",
			url : "/sugang/regdelete",
			data : {courseid : _id},
			success : function(res){
				if(res.result == "success"){
					window.location.reload();
				}
			}
		});
	});



	$('.putbagBtn').on('click', function(){
		var _id = $(this).data('id');
		//console.log(table);

		$.ajax({
			type : "POST",
			url : "/gls/putinbag",
			data : {courseid : _id},
			success : function(res){
				if(res.result == "exist"){
					alert("already in my course bag");
				}
				else{
					window.location.replace('/gls/putinbag');
					/*console.log("-------");
					console.log("x = "+res.result);
					var table = document.getElementById("stcoursetable");
					console.log("putbagBtn success");
					for (var i=0; i<table.rows.length; i++){
						var x = table.rows[i].cells;
						//console.log(x[0].innerHTML);
						if(x[0].innerHTML == _id){
							break;
						}
					}
					console.log("11 : "+x[1].innerHTML);

					var bagtable = document.getElementById("coursebagtable");
					var row = bagtable.insertRow(-1);
					for(var i=0; i<7; i++){
						var c = row.insertCell(i);
						if(i==5){
							c.innerHTML = String(res.result	);
						}
						else if(i==6){
							c.innerHTML = '<button class="delbagBtn btn btn-info btn-lg" type="button" style="align:center" data-id=_id>Put out from Bag</button>';
							
						}
						else{
							var c = row.insertCell(i);
							var k = x[i].innerHTML;
							c.innerHTML= String(k);
						}

						c.className = 'tablec';*/
					}
					//var c = row.insertCell(5);



					//console.log("selected : "+x[0].innerHTML);






				}
			
		});
	});


	$(".nav-link").click(function(){
		// this is midterm's answer. just refer it.

		var id = ['navHome','navAddCourse', 'navCourseList', 'navStudentInfo', 'navCourseInfo', 'navCourseBag'];
		
		for(var i=0;i<id.length;i++)
		{
			if($(this).attr('class') == 'nav-link disabled')
				break;

			if($(this).attr('id') == id[i])
			{
				$('#'+id[i]).addClass('active');
				$('#'+id[i]+'Content').addClass('show');
				$('#'+id[i]+'Content').addClass('active');
				$('#'+id[i]+'Content').show();
			}
			else
			{
				$('#'+id[i]).removeClass('active');
				$('#'+id[i]+'Content').hide();
				$('#'+id[i]+'Content').removeClass('show');
				$('#'+id[i]+'Content').addClass('hide');
			}

		}
		
	});
});