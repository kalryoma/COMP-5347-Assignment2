let mongoose = require('./db');

let RevisionSchema = new mongoose.Schema({
    title: String,
    timestamp: Date,
    user: String,
    anon: String
});

let revision = mongoose.model('revision', RevisionSchema, 'revision');

module.exports = revision;