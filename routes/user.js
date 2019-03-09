var express = require('express');
var router = express.Router();
var multer = require('multer');
var userControl = require('../controllers/user');
var auth = require('../middleware/auth')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.query.id}.jpg`); //Appending .jpg to to user id
  }
});
var upload = multer({ storage: storage });

router.get('/',userControl.Test);
router.post('/signup', userControl.signUp);
router.post('/locUpdate', auth.isAuthentication, userControl.updateLoc);
router.post('/eduUpdate', auth.isAuthentication, userControl.updateEdu);
router.post('/sklUpdate', auth.isAuthentication, userControl.updateSkills);
router.post('/intUpdate', auth.isAuthentication, userControl.updateInterests);
router.delete('/del', upload.single(), auth.isAuthentication, userControl.deleteUser);
router.post('/picUpload',upload.single('image'), auth.isAuthentication, userControl.picUpload );
router.get('/locFind', auth.isAuthentication, userControl.findByLoc);
router.get('/nameFind', auth.isAuthentication, userControl.findByName);
router.get('/opportunities', auth.isAuthentication, userControl.isHiring);
router.post('/apply', auth.isAuthentication, userControl.apply);
router.post('/login',userControl.authentication);

module.exports = router;