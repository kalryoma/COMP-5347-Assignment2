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
                    console.log("RevisionNumByArticle: "+ (new Date() - start).toString());
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
                    console.log("UniqueUserNumByArticle: " + (new Date() - start).toString());
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
                    console.log("HistoryByArticle: " + (new Date() - start).toString());
                    resolve(returnData);
                }
            });
        })
        RevisionNumByUserType = new Promise((resolve, reject) => {
            revision.getRevisionNumByUserType(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    returnData["RevisionNumByUserType"] = result;
                    console.log("RevisionNumByUserType: " + (new Date() - start).toString());
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
        return res.status(500).send({ message: 'Aggregate by Article Failed!' });
    }
}

module.exports.getArticleName = async function (req, res, next) {
    let articleName = [];
    try {
        let start = new Date();
        ArticleName = new Promise((resolve, reject) => {
            revision.getArticleName(function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    articleName = result;
                    console.log("ArticleName: " + (new Date() - start).toString());
                    resolve(articleName);
                }
            });
        });
        await ArticleName;
        return res.send(articleName);
    }
    catch (err){
        return res.status(500).send({ message: 'Get All Article Name Failed!' });
    }
}

module.exports.getArticleData = async function (req, res, next) {
    if (req.body.title){
        let title = req.body.title;
        let articleData = {};
        try {
            let start = new Date();
            // fetch API
            // await new Promise((resolve, reject) => {
                
            // });
            ArticleData = new Promise((resolve, reject) => {
                revision.getArticleData(title, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        articleData["ArticleData"] = result;
                        console.log("ArticleData: " + (new Date() - start).toString());
                        resolve(articleData);
                    }
                });
            });
            ArticleDataByUser =  new Promise((resolve, reject) => {
                revision.getArticleDataByUser(title, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        articleData["ArticleDataByUser"] = result;
                        console.log("ArticleDataByUser: " + (new Date() - start).toString());
                        resolve(articleData["ArticleDataByUser"]);
                    }
                });
            }).then(function (result) {
                let promiseList = [];
                result.forEach(element => {
                    let user = element["user"];
                    promiseList.push(new Promise((resolve, reject) => {
                        revision.getArticleDataByUserInYear(title, user, function (err, result) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    }));
                });
                return Promise.all(promiseList).then(values=>{
                    articleData["ArticleDataByUserInYear"] = {}
                    for (let i = 0; i < values.length; i++) {
                        let user = result[i]["user"];
                        articleData["ArticleDataByUserInYear"][user] = values[i];
                    }
                    console.log("ArticleDataByuserInYear: " + (new Date() - start).toString());
                });
            });
            await ArticleData;
            await ArticleDataByUser;
            return res.send(articleData);
        } catch (err) {
            return res.status(500).send({ message: 'Get All Article Name Failed!' });
        }
    }
    else {
        return res.send("Please Select an Article!");
    }
}