const express = require('express'),
  router = express.Router(),
  multer = require('multer'),
  userControl = require('../controllers/user'),
  auth = require('../middleware/auth');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.decoded._id}.jpg`); //Appending .jpg to to user id
  }
});
var upload = multer({ storage: storage });

// router.get('/',userControl.Test);
router.put('/signup', userControl.signUp);
router.post('/locUpdate', auth.isAuthentication, userControl.updateLoc);
router.post('/eduUpdate', auth.isAuthentication, userControl.updateEdu);
router.post('/sklUpdate', auth.isAuthentication, userControl.updateSkills);
router.post('/intUpdate', auth.isAuthentication, userControl.updateInterests);
router.delete('/del', upload.single(), auth.isAuthentication, userControl.deleteUser);
router.post('/picUpload',auth.isAuthentication, upload.single('image'), userControl.picUpload );
router.get('/locFind', auth.isAuthentication, userControl.findByLoc);
router.get('/nameFind', auth.isAuthentication, userControl.findByName);
router.get('/opportunities', auth.isAuthentication, userControl.isHiring);
router.post('/apply', auth.isAuthentication, userControl.apply);
router.post('/login',userControl.authentication);

module.exports = router;