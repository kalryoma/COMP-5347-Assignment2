let mongoose = require('./db');

let TypeSchema = new mongoose.Schema({
    user: String,
    type: String
});



let userType = mongoose.model('userType', RevisionSchema, 'userType');

module.exports = userType;