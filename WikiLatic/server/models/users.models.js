let mongoose = require('./db');

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.statics.authenticate = function (username, password, callback) {
    this.findOne({username: username})
        .exec(function (err, result) {
            if (err) {
                return callback(err);
            }
            else if (!result) {
                let error = new Error("User not found, Please Register First!");
                error.status = 403;
                return callback(error);
            }
            else {
                if (password!=result.password) {
                    let error = new Error("Wrong Password!");
                    error.status = 401
                    return callback(error);
                }
                else {
                    return callback(null, result.username);
                }
            }
        })
}

let users = mongoose.model('users', UserSchema, 'users');

module.exports = users;