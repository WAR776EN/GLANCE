var userModel = require('../models/user');
var companyModel = require('../models/company');
const files = require('fs');
const ajv = require('ajv');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')
var userAjv = require('../schemas/user');
require('dotenv').config()

// establish ajv
const ajvConnect = new ajv({allErrors: true});
var validate = ajvConnect.compile(userAjv);

exports.Test = function(req, res){
	res.json({ message: req.decoded });
};

exports.signUp = function(req, res){
	var makeUser = new userModel({
		personal:{
			name: req.body.name.toLowerCase(),
			email: req.body.email.toLowerCase(),
			dob: req.body.dob,
			phone: req.body.phone,
			password: req.body.password
		}
	});

	var valid = validate(makeUser);

	if (valid){ 
		bcrypt.hash(req.body.password,saltRounds).then(function(hash){
			makeUser.personal.password = hash;
			makeUser.save(function(err){
				if (err){
					return err
				}
				res.status(201)
				res.send({status:'Success', message:'User created'});
			});
		});
	} else {
		res.status(400);
		res.send({status:'Error', message:'Signup Failed'});
	}
};

exports.updateLoc = function(req, res) {
	userModel.findById({_id:req.decoded._id}, 'location', function(err, data){
		if (err){
			res.status(404);
			res.send({status:'Failed', message: 'File Not Found', error: err});
		} else {
			let id = {_id:req.decoded._id};
			let locationUpdated = {
				country: req.body.country,
				province: req.body.province,
				address: req.body.address,
				zipCode: req.body.zip
			}
			userModel.findByIdAndUpdate(id, {$set:{location:locationUpdated}}, function(err){
				if (err){
					res.status(400);
					res.send({status:'Failed', message: 'Updating location failed', error: err});
				}
			});
			res.status(200);
			res.send({status:'Success', message:'Location Updated'});
		}
	});
};

exports.updateEdu = function(req, res) {
	userModel.findById( {_id: req.decoded._id}, 'education', function(err, data){
		if  (err){
			res.status(404);
			res.send({status:'Failed', message:'File Not Found', error:err});
		} else {
			let id = {_id:req.decoded._id};
			let eduUpdated = {
				degree: req.body.deg.toLowerCase(),
				major: req.body.maj.toLowerCase(),
				gpa: req.body.gpa
			}
			userModel.findByIdAndUpdate(id, {$set:{education:eduUpdated}}, function(err){
				if (err){
					res.status(400);
					res.send({status:'Failed',message:'Updating education failed', error:err});
				}
			});
			res.status(200);
			res.send({status:'Success', message:'Education Updated'});
		}
	});
}

exports.updateSkills = function(req, res) {
	userModel.findById( {_id: req.decoded._id}, 'skills', function(err, data){
		if  (err){
			res.status(404);
			res.send({status:'Failed', message:'File Not Found', error:err});
		} else {
			let id = {_id:req.decoded._id};
			let skills = data.skills;
			let newSkills = req.body.skills;
			for (let skill of newSkills){
				skills.push(skill.toLowerCase());
			}
			userModel.findByIdAndUpdate(id, {$set:{skills:skills}}, function(err){
				if (err){
					res.status(400);
					res.send({status:'Failed',message:'Updating skills failed', error:err});
				}
			});
			res.status(200);
			res.send({status:'Success', message:'Skills Updated'});
		}
	});
};

exports.updateInterests = function(req, res) {
	userModel.findById( {_id: req.decoded._id}, 'interests', function(err, data){
		if  (err){
			res.status(404);
			res.send({status:'Failed', message:'File Not Found', error:err});
		} else {
			let id = {_id:req.decoded._id};
			let interests = data.interests;
			let newInterests = req.body.interest;
			for (let interest of newInterests){
				interests.push(interest.toLowerCase());
			}
			userModel.findByIdAndUpdate(id, {$set:{interests:interests}}, function(err){
				if (err){
					res.status(400);
					res.send({status:'Failed', message:'Updating interests failed', error:err});
				}
			});
			res.status(200);
			res.send({status:'Success', message:'Interests Updated'});
		}
	});
};

exports.deleteUser = function(req, res) {
	userModel.findByIdAndDelete({_id:req.decoded._id}, function(err,data){
		if (err){
			res.status(404);
			res.send({status:'Failed', message:'File Not Found', error:err});
		} else {
			files.unlinkSync(`public/${req.decoded._id}.jpg`);
			res.status(200);
			res.send({status:'Success', message:`user id: ${req.decoded._id} deleted`});
		}
	});
};

exports.picUpload = function(req, res) {
	userModel.findById( {_id: req.decoded._id}, function(err, data){
		if  (err){
			res.status(404);
			res.send({status:'Failed', message:'File Not Found', error:err});
		} else {
			let id = {_id:req.decoded._id};
			let newImage = req.file ? req.file.filename: null;
			userModel.findByIdAndUpdate(id, {$set:{image:newImage}}, function(err){
				if (err){
					res.status(400);
					res.send({status:'Failed', message:'Uploading picture failed', error:err})
				}
			});
			res.status(200)
			res.send({status:'Success', message:'Picture uploaded'});
		}
	});
};

exports.findByLoc = function(req, res) {
	companyModel.find({$or:[
		{"location.country":req.query.loc.toLowerCase()},
		{"location.province":req.query.loc.toLowerCase()}]},
	'general location isHiring')
	.exec(function(err, data){
		console.log(data)
		if (err){
			res.status(404);
			res.send({status:'Failed', message:'File Not Found', error:err});
		} else {
			res.status(200);
			res.send({status:'Success', result:data});
		}
	});
};

exports.findByName = function(req, res) {
	companyModel.find({"general.name":req.query.name.toLowerCase()},'general location isHiring')
	.exec(function(err, data){
		if (err){
			res.status(404);
			res.send({status:'Failed', message:'File Not Found', error:err});
		} else {
			res.status(200);
			res.send({status:'Success', result:data});
		}
	});
};

exports.isHiring = function(req, res) {
	companyModel.find({isHiring:true}, 'general')
	.exec(function(err, data){
		if (err){
			res.status(400);
			res.send({status:'Failed', message:'File Not Found', error:err});
		} else {
			res.status(200);
			res.send({status:'Success', result:data})
		}
	})
}

exports.apply = function(req, res) {
	companyModel.findOneAndUpdate({"general.name":req.body.name},{$push:{aplicants:req.decoded._id}},
	function(err, data){
			if (err){
				res.status(404);
				res.send({status:'Failed', message:'File Not Found', error:err})
			}
		})
		
	companyModel.findOne({"general.name":req.body.name})
	.populate('aplicants','-applied -personal.password')
	.exec(function(err, data){
		if (err){
			res.status(400);
			res.send({status:'Failed', message:'Populating to applicants failed', error:err});
		}
		userModel.findByIdAndUpdate(req.query.id, {$push:{applied:data._id}}, function(err,data){
			if (err){
				res.status(400);
				res.send({status:'Failed', message:'Updating to applied failed', error: err});
			}
			userModel.findOne({_id:req.decoded._id})
			.populate('applied')
			.exec(function(err,userData){
				if (err){
					res.status(400);
					res.send({status:'Failed', message:'Populating to applied failed', error:err});
				}
			})
		})
		res.status(200);
		res.send({status:'Success', message:'Company applied'})
	})
}

exports.authentication = function(req, res){
	let user = userModel.findOne({"personal.name": req.body.name},function(err, obj){
		if (!err) {
			return obj
		}
	})
	user.then((user) => {
		bcrypt.compare(req.body.password, user.personal.password).then(function (result){
			if (result){
				var token = jwt.sign(user.toJSON(),'jwtsecret',{ // gnerate token jwt
					algorithm: 'HS256'
				})
				res.status(200)
				res.send({status:'Success', message:'Authenticated', token:token})
			} else {
				res.status(401)
				res.send({status:'Failed', message:'Wrong Password'})
			}
		}).catch((err) => {err})
	})
}
