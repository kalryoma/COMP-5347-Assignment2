let mongoose = require('./db');

let RevisionSchema = new mongoose.Schema({
    title: String,
    timestamp: Date,
    user: String,
    anon: String
});

RevisionSchema.statics.getRevisionNumByArticle = function (callback) {
    let top = [];
    let bottom = [];
    this.aggregate([{
            $group: {
                _id: "$title",
                revision_num: { $sum: 1 }
            }
        }, {
            $project: {
                title: "$_id",
                _id : 0,
                revision_num: 1
            }
        }, {
            $sort: { revision_num: -1 }
    }])
    .then(function (result) {
        top = result.slice(0, 10);
        bottom = result.slice(-10);
        return callback(null, top, bottom);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.statics.getUniqueUserNumByArticle = function (callback) {
    let top = [];
    let bottom = [];
    this.aggregate([{
            $match: {type: "regular"} 
        },{
            $group: {
                _id: "$title",
                userSet: { $addToSet: "$user" }
            }
        }, {
            $project: {
                title: "$_id",
                _id : 0,
                userNum: { $size: "$userSet" }
            }
        },{
            $sort: { userNum: -1 }
    }])
    .then(function (result) {
        top = result.slice(0, 1);
        bottom = result.slice(-1);
        return callback(null, top, bottom);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.statics.getHistoryByArticle = function (callback) {
    let top = [];
    let bottom = [];
    this.aggregate([{
            $group: {
                _id: "$title",
                firstTime: { $min: "$timestamp" },
                lastTime: { $max: "$timestamp" }
            }
        }, {
            $project: {
                title: "$_id",
                _id : 0,
                firstTime: 1,
                lastTime: 1
            }
    }])
    .then(function (result) {
        result.forEach(element => {
            element.history = new Date(element.lastTime)-new Date(element.firstTime);
        });
        result.sort((a, b) => b.history-a.history);
        top = result.slice(0, 3);
        bottom = result.slice(-3);
        return callback(null, top, bottom);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.statics.getRevisionNumByUserType = function (callback) {
    this.aggregate([{
            $project: {
                title: 1,
                year: {$year: "$timestamp"},
                type: 1
            }
        },{
            $group: {
                _id: {
                    type: "$type",
                    year: "$year"
                },
                revision_num: { $sum: 1 }
            }
        },{
            $project: {
                userType: "$_id.type",
                year: "$_id.year",
                _id: 0,
                revision_num: 1
            }
    }])
    .then(function (result) {
        return callback(null, result);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.statics.getArticleName = function (callback) {
    this.aggregate([{
            $group: {
                _id: "$title",
                revision_num: { $sum: 1 }
            }
        }, {
            $project: {
                title: "$_id",
                _id : 0,
                revision_num: 1
            }
        }, {
            $sort: { revision_num: -1 }
    }])
    .then(function (result) {
        return callback(null, result);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.statics.getArticleData = function (title, callback) {
    this.aggregate([{
            $match: { title: title}
        }, {
            $project: {
                title: 1,
                year: {$year: "$timestamp"},
                type: 1
            }
        },{
            $group: {
                _id: {
                    type: "$type",
                    year: "$year"
                },
                revision_num: { $sum: 1 }
            }
        },{
            $project: {
                userType: "$_id.type",
                year: "$_id.year",
                _id: 0,
                revision_num: 1
            }
    }])
    .then(function (result) {
        return callback(null, result);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.statics.getLatestRevision = function (title, callback) {
    this.aggregate([{
            $match: { title: title }
        }, {
            $group: {
                _id: "$title",
                lastTime: { $max: "$timestamp" }
            }
    }])
    .then(function (result) {
        return callback(null, result[0]["lastTime"]);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.statics.getArticleDataByUser = function (title, callback) {
    this.aggregate([{
            $match: { 
                title: title,
                type: "regular"
             }
        }, {
            $group: {
                _id: "$user",
                revision_num: { $sum: 1 }
            }
        },{
            $sort: { revision_num: -1 }
        }, {
            $limit: 5
        }, {
            $project: {
                user: "$_id",
                _id: 0,
                revision_num: 1
            }
    }])
    .then(function (result) {
        return callback(null, result);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.statics.getArticleDataByUserInYear = function (title, user, callback) {
    this.aggregate([{
            $match: {
                title: title,
                user: user
            }
        }, {
            $project: {
                title: 1,
                year: {$year: "$timestamp"},
            }
        },{
            $group: {
                _id: "$year",
                revision_num: { $sum: 1 }
            }
        },{
            $project: {
                year: "$_id",
                _id: 0,
                revision_num: 1
            }
    }])
    .then(function (result) {
        return callback(null, result);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.statics.getAuthorData = function (author, callback) {
    this.aggregate([{
            $match: { user: author}
        }, {
            $group: {
                _id: "$title",
                revision_time: { $push: "$timestamp" },
                revision_num: { $sum: 1 }
            }
        }, {
            $sort: { revision_num: -1 }
        }, {
            $project: {
                title: "$_id",
                _id: 0,
                revision_num: 1,
                revision_time: 1
            }
    }])
    .then(function (result) {
        return callback(null, result);
    })
    .catch(function (err) {
        return callback(err);
    });
}

RevisionSchema.methods.saveRevision = function () {
    
}

let revision = mongoose.model('revision', RevisionSchema, 'revisions');

module.exports = revision;