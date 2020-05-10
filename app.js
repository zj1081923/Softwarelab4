var http = require('http');
var express = require('express');
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();

var mongoose = require('mongoose');
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
	console.log("connected to mongod server");
});

mongoose.connect('mongodb://localhost/project', {useNewUrlParser : true});


app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

var users = require('./models/user');
var classes = require('./models/class');

app.get('/', function(req, res){
	console.log("start page");
	var id = req.cookies.student_id;
	res.cookie('pages','human');
	var pages = 'human';
	var signin = req.cookies.signin;
	//var failure = req.cookies.failure;
	res.cookie('pages', pages);
	res.render('human-index', {student_id : id, signin : signin});
});

app.post('/', function(req, res){
	var id = req.cookies.student_id;
	var p = req.cookies.pages;
	var signin = req.cookies.signin;
	//var failure = req.cookies.failure;
	res.cookie('student_id', null);
	if(p == 'human'){
		res.render('human-index', {student_id : id, signin : signin});
	}
	else{
		res.render('natural-index', {student_id : id, signin : signin});
	}

});



app.get('/natural', function(req, res){
	console.log("natural");
	var id = req.cookies.student_id;
	res.cookie('pages', 'natural');
	var signin = req.cookies.signin;
	res.render('natural-index', {student_id : id, signin : signin});
});

app.get('/human', function(req, res){
	console.log("human");
	res.cookie('pages','human');
	console.log(req.cookies);
	var id = req.cookies.student_id;
	var signin = req.cookies.signin;
	res.render('human-index', {student_id : id, signin : signin});
});



app.get('/gls/coursebag',function(req, res){
	console.log("coursebag");
	var id = req.cookies.student_id;
	var usertype = req.cookies.usertype;
	users.find({$and : [{student_id : id}]}, function(err, student){
		if(student){
			var student_info = student;
			var bag = student.student_bag;
			classes.find({}, function(err, course){
				if(course){
					var allcourse = course;
					var course_null = 'not_empty';
					classes.find({$and:[{class_id : bag}]}, function(err, bag_course){
						if(bag_course){
							res.render('gls_main', {bags: bag_course, std_info : student, usertype:usertype, allcourse:course, cpage: CB});
						}
					});
				}
			});
		}
	});
});

app.get('/gls', function(req, res){
	console.log("gls");
	console.log(req.cookies);
	var usertype = req.cookies.usertype;
	var id = req.cookies.student_id;
	users.findOne({$and : [{student_id:id}]}, function(err, student){
		if(student){
			var student_info = student;
			var bag = student.student_bag;
			var reg = student.student_reg;
			classes.find({}, function(err, course){
				if(course){
					var allcourse = course;
					var course_null = 'not_empty';
					classes.find({$and:[{class_id : bag}]}, function(err, bag_course){
						if(bag_course){
							classes.find({$and:[{class_id : reg}]}, function(err, reg_course){
								res.render('gls_main', {regs: reg_course, bags: bag_course, std_info : student, usertype : usertype, allcourse : course});
							});

							
						}
					});
				}
			});
		}
	});
});
app.get('/sugang', function(req, res){
	console.log("---------/sugang---------");
	var id = req.cookies.student_id;
	var usertype = req.cookies.usertype;
	if(usertype == 'Admin'){
		users.findOne({$and : [{student_id:id}]}, function(err, student){
			if(student){
				var student_info = student;
				var bag = student.student_bag;
				classes.find({}, function(err, course){
					if(course){
						var allcourse = course;
						var course_null = 'not_empty';
						classes.find({$and:[{class_id : bag}]}, function(err, bag_course){
							if(bag_course){
								res.render('gls_main', {bags: bag_course, std_info : student, usertype : usertype, allcourse : course});
							}
						});
					}
				});
			}
		});
	}
	else if(usertype == 'Student'){
		users.findOne({$and : [{student_id:id}]}, function(err, student){
			if(student){
				var student_info = student;
				var bag = student.student_bag;
				classes.find({}, function(err, course){
					if(course){
						var allcourse = course;
						var course_null = 'not_empty';
						classes.find({$and:[{class_id : bag}]}, function(err, bag_course){
							if(bag_course){
								classes.find({$and:[{class_id : student.student_reg}]}, function(err, reg_course){
									res.render('sugang', {regs: reg_course,bags: bag_course, std_info : student, usertype : usertype, allcourse : course});
								});
								
							}
						});
					}
				});
			}
		});
	}
});





app.post('/user/register', function(req, res){
	console.log(req.body);
	const regid = new users();
	regid.student_id = req.body.newid;
	regid.student_pa = req.body.newpassword;
	regid.student_name = req.body.newname;
	regid.student_birth = req.body.newbirth;
	regid.student_department = req.body.newdepartment;
	regid.allowcredit = String(18);
	var p = req.cookies.pages;
	if(regid.student_id == "" || regid.student_pa == "" || regid.student_name == "" || regid.student_birth == "" || regid.student_department == ""){
		res.send({result : "empty"});
	}
	else{
		users.findOne({$and : [{student_id:req.body.newid}]}, function(err, student){
		if(student != null){
			res.send({result : "exist"});
		}
		else{
			res.cookie('signin','no');
			regid.save(function(err){console.log("sign-in success!!")});
			res.send({result : "success"});
		}
	});

	}
});

app.post('/user/login', function(req,res){
	console.log(req.body);
	const student = new users();
	student.student_id = req.body.id;
	student.student_pa = req.body.password;
	var p = req.cookies.pages;
	console.log("in login: "+ student.student_id + " " + student.student_pa);

	if(student.student_id == "" || student.student_pa == ""){
		res.send({result : "empty"});
	}/*else{
		if(req.body.id == "admin" && req.body.password == "1234"){
			res.cookie('usertype', 'Admin');
			console.log("usertype = "+req.cookies.usertype);
			res.cookie('signin', 'yes');
			console.log("signin = "+req.cookies.signin);
			res.cookie('student_id',student.student_id);
			res.send({result : "success"});
		}*/


		else{
			users.findOne({$and : [{student_id:req.body.id},{student_pa : req.body.password}]},function(err,student11){
				if(student11 != null){
					if(student11.student_id == 'admin' && student11.student_pa == '1234'){
						res.cookie('usertype', 'Admin');
						res.cookie('signin', 'yes');
						res.cookie('student_id', student.student_id);
						res.send({result : "success"});

					}else{
						res.cookie('usertype', 'Student');
						console.log("login success");
						console.log("usertype = " + req.cookies.usertype);
						res.cookie('signin', 'yes');
						res.cookie('student_id', student.student_id);
						res.send({result : "success"});
					}

				}
				else{
					console.log("login fail");
					res.cookie('signin', 'no');
					res.cookie('student_id', null);
					res.send({result : "fail"});
			
				}
			});
		}
	//}
});




app.get('/gls/putinbag',function(req, res){
	console.log("putinbag");
	console.log(req.cookies);
	var usertype = req.cookies.usertype;
	var id = req.cookies.student_id;
	users.findOne({$and : [{student_id:id}]}, function(err, student){
		if(student){
			var student_info = student;
			var bag = student.student_bag;
			classes.find({}, function(err, course){
				if(course){
					var allcourse = course;
					var course_null = 'not_empty';
					classes.find({$and:[{class_id : bag}]}, function(err, bag_course){
						if(bag_course){
							res.render('gls_main', {bags: bag_course, std_info : student, usertype : usertype, allcourse : course, cpage:"CB"});
						}
					});
				}
			});
		}
	});
});

app.post('/sugang/regdelete', function(req, res){
	var courseid = req.body.courseid;
	classes.findOne({$and : [{class_id : courseid}]}, function(err, course){
		var coursenumreg = parseInt(course.class_numreg);
		coursenumreg = coursenumreg - 1;
		coursenumreg = String(coursenumreg);
		classes.findOneAndUpdate({$and : [{class_id : courseid}]}, {$set : {class_numreg : coursenumreg}},{returnNewDocument : true, useFindAndModify: false}, function(err,c1){
			users.findOne({$and : [{student_id : req.cookies.student_id}]}, function(err, std){
				for (var i=0; i<std.student_reg.length; i++){
					if(courseid == std.student_reg[i]){
						var exsit = 1;
						var x = std.student_reg.splice(i,1);
						var coursecredit = parseInt(course.class_credit);
						var stdcredit = parseInt(std.allowcredit);
						stdcredit = stdcredit + coursecredit;
						stdcredit = String(stdcredit);
						users.findOneAndUpdate({$and: [{student_id :req.cookies.student_id}]}, {$set : {student_reg : std.student_reg, allowcredit : stdcredit}}, {returnNewDocument: true, useFindAndModify: false}, function(err, std_edit){
							res.send({result : "success"});
						});
					}
				}
			});
		});
	});
});


app.post('/gls/delbag', function(req, res){
	var id = req.body.courseid;
	users.findOne({$and : [{student_id : req.cookies.student_id}]}, function(err, std){
		for (var i=0; i<std.student_bag.length; i++){
			if(id == std.student_bag[i]){
				var exsit = 1;
				var x = std.student_bag.splice(i,1);
				users.findOneAndUpdate({$and: [{student_id : req.cookies.student_id}]}, {$set : {student_bag : std.student_bag}}, {returnNewDocument : true, useFindAndModify: false}, function(err,std1){
					console.log("delete!!!");
					res.send({result : "success"});
				});
			}
		}
	});
});


app.post('/sugang/register', function(req, res){
	console.log("------/sugang/register---------");
	var classid = req.body.courseid;
	var userid = req.cookies.student_id;

	users.findOne({$and : [{student_id : userid}]}, function(err, student){
		console.log(student);
		var check = 0;
		for(var i=0; i<student.student_reg.length; i++){
			if(student.student_reg[i] == classid){
				console.log("register exist!!!!!!!!!!");
				check=1;
			}
		}

		if(check == 1) res.send({result : "exist"});
		else{
			classes.findOne({$and : [{class_id : classid}]},function(err, course){
				var coursereg = parseInt(course.class_numreg);
				var coursemax = parseInt(course.class_max);
				var coursecredit = parseInt(course.class_credit);
				var stdcredit = parseInt(student.allowcredit);
				console.log(coursereg+", "+coursemax+", "+coursecredit+", "+stdcredit);
				if(coursemax-coursereg <= 0) res.send({result : "full"});
				else if(stdcredit-coursecredit<0) res.send({result : "lackcredit"});
				else{
					var c=0;
					var c1=0;
					var coursereg = coursereg+1;
					coursereg = String(coursereg);
					console.log("111111111111111111111111111111");
					classes.findOneAndUpdate({$and : [{class_id : classid}]}, {$set : {class_numreg : coursereg}},{returnNewDocument: true, useFindAndModify: false}, function(err, class_edt){
						if(err) return err;
						console.log(class_edt);
						var tmp = student.student_reg.push(String(classid));
						console.log(student.student_reg);
						var tmpc = stdcredit - coursecredit;
						tmpc = String(tmpc);
						console.log("tmpc = "+tmpc);
						users.findOneAndUpdate({$and : [{student_id : userid}]}, {$set : {student_reg : student.student_reg, allowcredit : tmpc}}, {returnNewDocument: true, useFindAndModify: false}, function(err, std_edt){
							console.log("update reg!!!");
							res.send({result : "success"});
						});


					});
					
											
				}
			});
		}


	});
	
});
app.post('/gls/putinbag', function(req, res){
	console.log("--------------------------------------------");
	const std = new users();
	var userid = req.cookies.student_id;
	var classid = req.body.courseid;
	console.log("putinbag id = " + classid);
	var check = 0;

	users.findOne({$and : [{student_id : userid}]}, function(err, student){
		//console.log("in if --\n" + student.student_reg.length);
		console.log(student);
		for (var i=0; i<student.student_bag.length; i++){
			if(student.student_bag[i] == classid){
				//res.send({result : "exist"});///////
				console.log("in if statement : "+student.student_bag[i]+", "+classid);
				//res.send({result : "exist"});
				check = 1;
			}
		}

		if(check == 1) res.send({result : "exist"});
		else{
			//console.log("st :"+student); 	
			console.log("before push = " + student.student_bag);

			var bag = student.student_bag.push(String(classid));

			users.findOneAndUpdate({$and : [{student_id : userid}]}, {$set : {student_bag : student.student_bag}}, { returnNewDocument: true, useFindAndModify: false }, function(err, student_edt){
			//users.update({$and : [{student_id : userid}]}, {$set : {student_bag : bag}}, function(err, std){

				//});	
				if(err) return done(err);
				else{

					classes.findOne({$and : [{class_id : classid}]}, function(err, course){
						var x = course.class_numreg;
						console.log("x = "+x);
						console.log("success : " + student_edt.student_bag);
						res.send({result : x});
					});


					
				}
			});
		//res.send({result : "false"});*/
		}

						
	});


	//res.send({result : "success"});
});

app.post('/admin/addcourse', function(req, res){
	const course = new classes();
	course.class_id = req.body.newcourseid;
	course.class_name = req.body.newcoursename;
	course.class_professor = req.body.newcourseprofessor
	course.class_max = req.body.newcoursemax;
	course.class_credit = req.body.newcoursecredit;
	var initnum = 0;
	course.class_numreg = initnum.toString();

	if(course.class_id == "" || course.class_name == "" || course.class_professor == "" || course.class_max == "" || course.class_credit == ""){
		res.send({result : "empty"});
	}else{
		classes.findOne({$and : [{class_id:req.body.newcourseid}]},function(err,course1){
			if(course1 != null){
				console.log("exist course!");
				res.send({result : "exist"});
			}
			else{
				console.log("add course!");
				course.save(function(err){console.log("add course success!!")});
				/*classes.find({}, function(err, Classes){
					if(err) return done(err);
					if(Classes){
						console.log("classes : "+Classes);
						res.send({result : Classes});
					}
				});*/
				res.send({result : "success"});
			}
		});



	}


});


app.listen(8000, function(){
	console.log("server is ready on port 8000!");
});
