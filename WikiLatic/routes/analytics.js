var express = require('express');
var router = express.Router();
let controllers = require('../controllers/revision.controllers');

router.get('/overall', controllers.getOverallData);
router.get('/individual', controllers.getArticleName);
router.post('/individual', controllers.getArticleData);

module.exports = router;