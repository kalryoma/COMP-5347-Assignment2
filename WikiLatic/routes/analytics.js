var express = require('express');
var router = express.Router();
let controllers = require('../controllers/revision.controllers');

router.get('/overall', controllers.getOverallData);

module.exports = router;