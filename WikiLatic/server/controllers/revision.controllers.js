let revision = require('../models/revision.models');
let userType = require('../models/types.models');
let fetch = require('node-fetch-json');

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
            await new Promise((resolve, reject) => {
                revision.getLatestRevision(title, function (err, result) {
                    if (err) {
                        reject(err);
                    } else { 
                        console.log("LatestRevision: " + (new Date() - start).toString());
                        resolve(result);
                    }
                })
            }).then(function (latest) {
                if (new Date()-latest>=24*3600*1000){
                    let url = "https://en.wikipedia.org/w/api.php?action=query";
                    url += "&titles="+title.replace(" ", "%20");
                    url += "&prop=revisions&rvprop=timestamp|user";
                    latest.setSeconds(latest.getSeconds()+1);
                    url += "&rvend="+latest.toISOString();
                    url += "&format=json&formatversion=2";
                    let fetchData = fetch(url, {method: "GET"})
                        .then(function (data) {
                            data = data["query"]["pages"][0]["revisions"];
                            articleData["DownloadNum"] = data? data.length: 0;
                            if (articleData["DownloadNum"] > 0 && req.body.save) {
                                data.forEach(async element => {
                                    let type = element["anon"]? "anon" : "";
                                    await new Promise((resolve, reject) => {
                                        if (type==""){
                                            userType.getType(element["user"], function (err, result) {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    type = result;
                                                    console.log(element["user"]+" UserType: " + (new Date() - start).toString());
                                                    resolve(type);
                                                }
                                            });
                                        }
                                    }).then(function (resultType) {
                                        let newRevision = new revision({
                                            title: title,
                                            timestamp: new Date(element["timestamp"]),
                                            user: element["user"],
                                            type: type
                                        });
                                        newRevision.isNew = true;
                                        newRevision.save(err => {
                                            if (err) 
                                                throw new Error(err);
                                        });
                                    });
                                });
                            }
                        });
                    return fetchData;
                }
            });
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

module.exports.getAuthorData = async function (req, res, next) {
    if (req.body.author){
        let author = req.body.author;
        let authorData = [];
        try {
            let start = new Date();
            AuthorData = new Promise((resolve, reject) => {
                revision.getAuthorData(author, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        authorData = result;
                        console.log("AuthorData: " + (new Date() - start).toString());
                        if (authorData.length==0){
                            reject("NoAuthor");
                        }
                        else {
                            resolve(authorData);
                        }
                    }
                });
            });
            await AuthorData;
            return res.send(authorData);
        } catch (err) {
            if (err=="NoAuthor") {
                return res.send({ message: 'Author does not Exist, Try Another One!' });
            }
            else {
                return res.status(500).send({ message: 'Get User Data Failed!' });
            }
        }
    }
    else {
        return res.send("Please Enter an Author!");
    }
}