var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var classes = new Schema({
	class_id : String,
	class_name : String,
	class_professor : String,
	class_max : String,
	class_credit : String,
	class_numreg : String,
	test_list : []
});

module.exports = mongoose.model('class', classes)