var express = require('express');
var router = express.Router();
let controller = require("../controllers/users.controllers");

/* GET users listing. */
router.get('/', controller.getLoginStatus);

module.exports = router;
