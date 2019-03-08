var mongoose = require('mongoose');
var company = mongoose.Schema;
var schemaCompany = new company({
	general:{
		name: {type: String, required: true},
		business: {type: String, required:true}, // tech, education, energy, etc
    type: {type: String, required: true}, // startUp, BUMN, Private, etc
    website: {type: String, required: true}
	},
	location:{
		country: {type: String, default: 'IDN'},
		province: {type: String, default: 'West Java'},
		address: {type: String, default: null},
    zipCode: {type: Number, default: null},
	},
	isHiring: {type: Boolean, required: false, default: false},
	aplicants: [{
		type: company.Types.ObjectId,
		ref: 'user'
	}]
});

module.exports = mongoose.model('company',schemaCompany);