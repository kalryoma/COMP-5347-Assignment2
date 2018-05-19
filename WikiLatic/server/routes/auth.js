var express = require('express');
var router = express.Router();
let controllers = require('../controllers/users.controllers');

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.post('/register', controllers.userRegister);
router.post('/login', controllers.userLogin);
router.get('/logout', controllers.userLogout);

// router.get('/analytics', controllers.authenticate, function (req, res, next) {
//     res.redirect('/analytics/overall');
// });

module.exports = router;