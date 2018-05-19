let users = require('../models/users.models');

module.exports.authenticate = function (req, res, next) {
    if (req.session && req.session.username){
        console.log(req.session.username+' already logged in.');
        return next();
    }
    else {
        res.statusCode = 401;
        return res.send("You need to log in.");
    }
}
module.exports.userLogout = function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                console.log(req.session.username + " Logout Succeed!");
                return res.redirect('/');
            }
        });
    }
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
                req.session.username = username;
                console.log(username + " Login Succeed!");
                return res.redirect('/analytics/overall');
            }
        });
    }
    else {
        return res.send("Please fill out the form!");
    }
}