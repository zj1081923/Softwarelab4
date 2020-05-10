var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('user', students);
