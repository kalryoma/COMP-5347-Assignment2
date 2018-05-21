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

module.exports = router;