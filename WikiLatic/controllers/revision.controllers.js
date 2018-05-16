let revision = require('../models/revision.models');

module.exports.getOverallData = async function (req, res, next) {
    let returnData = {};
    try {
        RevisionNumByArticle = new Promise((resolve, reject) => {
            revision.getRevisionNumByArticle(function (err, top, bottom) {
                if (err) {
                    reject(err);
                } else {
                    returnData["TopArticleRevisionNum"] = top;
                    returnData["BottomArticleRevisionNum"] = bottom;
                    resolve(returnData);
                }
            });
        })
        UniqueUserNumByArticle = new Promise((resolve, reject) => {
            revision.getUniqueUserNumByArticle(function (err, top, bottom) {
                if (err) {
                    reject(err);
                } else {
                    returnData["TopArticleUniqueUserNum"] = top;
                    returnData["BottomArticleUniqueUserNum"] = bottom;
                    resolve(returnData);
                }
            });
        })
        HistoryByArticle = new Promise((resolve, reject) => {
            revision.getHistoryByArticle(function (err, top, bottom) {
                if (err) {
                    reject(err);
                } else {
                    returnData["TopArticleHistory"] = top;
                    returnData["BottomArticleHistory"] = bottom;
                    resolve(returnData);
                }
            });
        })
        await RevisionNumByArticle;
        await UniqueUserNumByArticle;
        await HistoryByArticle;
        return res.send(returnData);
    }
    catch (err){
        return res.status(500).send({  message: 'Aggregate by Article Failed!' });
    }
}