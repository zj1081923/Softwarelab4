# Softwarelab4
final project, 수강신청 데모 시스템

## Schema
* user
```
var students = new Schema({
    student_id: String,
    student_pa : String,
    student_name : String,
    student_birth : String,
    student_department : String,
    student_bag : [],
    student_reg : [],
    allowcredit : String,
    test_list : []
});
```
* classes
```
var classes = new Schema({
	class_id : String,
	class_name : String,
	class_professor : String,
	class_max : String,
	class_credit : String,
	class_numreg : String,
	test_list : []
});
```

## Human, natural index
* signup
* login

## Gls_main
* usertype을 admin과 student로 나눔
* Admin
  Home, Add course, Course list
* Student
  Home, Student Info, Course info, Course bag, Go To Sugang
