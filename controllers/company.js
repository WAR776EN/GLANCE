var companyModel = require('../models/company');
const files = require('fs');

exports.Test = function(req, res){
  res.send('Hi! You\'re in Company Menu');
};

exports.register = function(req, res){
  var makeCompany = new companyModel({
    general:{
      name: req.body.name.toLowerCase(),
      business: req.body.business.toLowerCase(),
      type: req.body.type.toLowerCase(),
      website: req.body.website
    },
    location:{
      country: req.body.country.toLowerCase(),
      province: req.body.province.toLowerCase(),
      address: req.body.address.toLowerCase(),
      zipCode: req.body.zipCode
    },
    isHiring: req.body.isHiring ? req.body.isHiring : false
  });
		
  makeCompany.save(function(err){
    if (err){
      return res.status(400).json({status:'Error',message:err});
    } else {
      res.status(200).json({message:'Registered Successfully'});
    }
  });
};

exports.aplicants = function(req, res) {
  companyModel.find({'general.name':req.body.name},'aplicants')
    .exec(function(err, data){
      if (err){
        return res.status(400).json({status:'Error',message:err});
      } else {
        res.status(200);
        res.send({status:'Success', result:data});
      }
    });
};