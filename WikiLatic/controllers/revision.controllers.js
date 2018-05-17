let revision = require('../models/revision.models');

module.exports.getOverallData = async function (req, res, next) {
    let returnData = {};
    try {
        let start = new Date();
        RevisionNumByArticle = new Promise((resolve, reject) => {
            revision.getRevisionNumByArticle(function (err, top, bottom) {
                if (err) {
                    reject(err);
                } else {
                    returnData["TopArticleRevisionNum"] = top;
                    returnData["BottomArticleRevisionNum"] = bottom;
                    console.log(new Date() - start);
                    resolve(returnData);
                }
            });
        })
        start = new Date();
        UniqueUserNumByArticle = new Promise((resolve, reject) => {
            revision.getUniqueUserNumByArticle(function (err, top, bottom) {
                if (err) {
                    reject(err);
                } else {
                    returnData["TopArticleUniqueUserNum"] = top;
                    returnData["BottomArticleUniqueUserNum"] = bottom;
                    console.log(new Date() - start);
                    resolve(returnData);
                }
            });
        })
        start = new Date();
        HistoryByArticle = new Promise((resolve, reject) => {
            revision.getHistoryByArticle(function (err, top, bottom) {
                if (err) {
                    reject(err);
                } else {
                    returnData["TopArticleHistory"] = top;
                    returnData["BottomArticleHistory"] = bottom;
                    console.log(new Date() - start);
                    resolve(returnData);
                }
            });
        })
        start = new Date();
        RevisionNumByUserType = new Promise((resolve, reject) => {
            revision.getRevisionNumByUserType(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    returnData["RevisionNumByUserType"] = result;
                    console.log(new Date() - start);
                    resolve(returnData);
                }
            });
        })
        await RevisionNumByArticle;
        await UniqueUserNumByArticle;
        await HistoryByArticle;
        await RevisionNumByUserType;
        return res.send(returnData);
    }
    catch (err){
        return res.status(500).send({  message: 'Aggregate by Article Failed!' });
    }
}