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
        {   $sort: { revision_num: -1 } },
        {   $limit: 10 }
    ])
    .then(function (result) {
        top = result;
    })
    .catch(function (err) {
        return callback(err);
    });
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
        {   $sort: { revision_num: -1 } },
        {   $limit: 10 }
    ])
    .then(function (result) {
        bottom = result;
    })
    .catch(function (err) {
        return callback(err);
    });

    return callback(null, top, bottom);
}

RevisionSchema.statics.getUniqueUserNumByArticle() = function (callback) {
    let top = {};
    let bottom = {};
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
                "title": "$_id",
                _id : 0,
                userNum: { $size: "$userSet" }
            }
        },
        {   $sort: { userNum: -1 } },
        {   $limit: 1 }
    ])
    .then(function (result) {
        top = result;
    })
    .catch(function (err) {
        return callback(err);
    });
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
                "title": "$_id",
                _id : 0,
                userNum: { $size: "$userSet" }
            }
        },
        {   $sort: { userNum: 1 } },
        {   $limit: 1 }
    ])
    .then(function (result) {
        bottom = result;
    })
    .catch(function (err) {
        return callback(err);
    });

    return callback(null, top, bottom);
}

let revision = mongoose.model('revision', RevisionSchema, 'revision');

module.exports = revision;