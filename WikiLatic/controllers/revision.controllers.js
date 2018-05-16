let revision = require('../models/revision.models');

module.exports.getOverallData = function (req, res, next) {
    let returnData = {};

    revision.getRevisionNumByArticle(function (err, top, bottom) {
        if (err){
            return res.status(500).send({ message: 'Aggregate by Article Failed!' });
        }
        else{
            returnData["TopArticleRevisionNum"] = top;
            returnData["BottomArticleRevisionNum"] = bottom;
        }
    });

    revision.getUniqueUserNumByArticle(function (err, top, bottom) {
        if (err){
            return res.status(500).send({ message: 'Aggregate by Article Failed!' });
        }
        else{
            returnData["TopArticleUniqueUserNum"] = top;
            returnData["BottomArticleUniqueUserNum"] = bottom;
        }
    });

    
}