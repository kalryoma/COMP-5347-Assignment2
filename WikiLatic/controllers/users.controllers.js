let users = require('../models/users.models');

module.exports.getLoginStatus = function (req, res, next) {
    res.send("Hello World");
}

module.exports.userRegister = function (req, res, next) {
    if (req.body.username && req.body.password && req.body.confirmPW){
        let username = req.body.username;
        let password = req.body.password;
        let confirmPW = req.body.confirmPW;
        if (password !== confirmPW) {
            return res.send("Passwords not Match!");
        } else {
            let data = {
                username: username,
                password: password
            }
            users.create(data, function (err, user) {
                if (err){
                    return next(err);
                }
                res.send("User Created!");
                return next();
            });
        }
    }
    else {
        return res.send("Please fill out the form!");
    }
}

module.exports.userLogin = function (req, res, next) {
    if (req.body.username && req.body.password) {
        let username = req.body.username;
        let password = req.body.password;
        users.authenticate(username, password, function (err, username) {
            if (err) {
                res.statusCode = err.status;
                return res.send(err.message);
            }
            else {
                return res.send(username+" Login Succeed!");
            }
        });
    }
    else {
        return res.send("Please fill out the form!");
    }
}