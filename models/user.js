var mongoose = require('mongoose');
var user = mongoose.Schema;

var schemaUser = new user({
	personal:{
		name: {type: String, required: true},
		email: {type: String, required:true},
		dob: {type: Date, required: true},
		phone: {type: String, required: true},
		password: {type: String, required: true}
	},
	location:{
		country: {type: String, default: 'IDN'},
		province: {type: String, default: 'West Java'},
		address: {type: String, default: null},
		zipCode: {type: Number, default: null},
	},
	education:{
		degree: {type: String, default: null},
		major: {type: String, default: null},
		gpa: {type: Number, default: null}
	},
	skills: {type: [String], required: false, default: []},
	interests: {type: [String], required: false, default: []},
	image: {type: String, default: null},
	applied: [{
		type: user.Types.ObjectId,
		ref: 'company'
	}]
});

module.exports = mongoose.model('user',schemaUser);
