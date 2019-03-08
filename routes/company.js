var express = require('express');
var router = express.Router();
var multer = require('multer');
var companyControl = require('../controllers/company');

router.get('/',companyControl.Test);
router.post('/register',companyControl.register);
router.get('/aplicants',companyControl.aplicants);

module.exports = router;