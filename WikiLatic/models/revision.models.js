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
        },
        {
            $project: {
                title: "$_id",
                _id : 0,
                revision_num: 1
            }
        },
        {   $sort: { revision_num: -1 } }
    ])
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
    this.aggregate([
        {   $match: {anon: null} },
        {
            $group: {
                _id: "$title",
                userSet: { $addToSet: "$user" }
            }
        },
        {
            $project: {
                title: "$_id",
                _id : 0,
                userNum: { $size: "$userSet" }
            }
        },
        {   $sort: { userNum: -1 } }
    ])
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
    this.aggregate([
        {
            $project: {
                timestamp: {
                    $dateFromString: { dateString: "$timestamp" }
                },
                title: 1,
                _id: 0
            }
        },
        {
            $group: {
                _id: "$title",
                firstTime: { $min: "$timestamp" },
                lastTime: { $max: "$timestamp" }
            }
        },
        {
            $project: {
                title: "$_id",
                _id : 0,
                history: { "$subtract": [ "$lastTime", "$firstTime" ] }
            }
        },
        {   $sort: { history: -1 } }
    ])
    .then(function (result) {
        top = result.slice(0, 3);
        bottom = result.slice(-3);
        return callback(null, top, bottom);
    })
    .catch(function (err) {
        return callback(err);
    });
}

let revision = mongoose.model('revision', RevisionSchema, 'revision');

module.exports = revision;