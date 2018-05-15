var express = require('express');
var router = express.Router();
let controller = require('../controllers/users.controllers');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/register', controller.userRegister);
router.post('/login', controller.userLogin);
router.get('/login', controller.getLoginStatus);
router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        console.log("Logout Succeed!");
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
