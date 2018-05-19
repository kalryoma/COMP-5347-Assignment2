let mongoose = require('./db');

let TypeSchema = new mongoose.Schema({
    user: String,
    type: String
});

TypeSchema.statics.getType = function (user, callback) {
    this.findOne({user: user})
        .exec(function (err, result) {
            if (err) {
                return callback(err);
            } else if (!result) {
                return callback(null, "regular");
            }
            else {
                return callback(null, result["type"])
            }
        });
}

let userType = mongoose.model('userType', TypeSchema, 'userType');

module.exports = userType;