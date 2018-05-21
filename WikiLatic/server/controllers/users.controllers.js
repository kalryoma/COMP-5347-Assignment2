let users = require('../models/users.models');
let jwt = require('jsonwebtoken');

function jwtSignUser(user) {
    return jwt.sign(user, 'secret', { expiresIn: 600 });
}

module.exports.userRegister = function (req, res, next) {
    if (req.body.username && req.body.password && req.body.confirmPW){
        let username = req.body.username;
        let password = req.body.password;
        let confirmPW = req.body.confirmPW;
        if (password !== confirmPW) {
            return res.status(400).send("Passwords not Match!");
        } else {
            let data = {
                username: username,
                password: password
            }
            users.create(data, function (err, user) {
                if (err){
                    return res.status(400).send('Username already registered!');
                }
                userJSON = {'user': username };
                return res.send({
                    msg: username+" Created! Please Login!",
                    token: jwtSignUser(userJSON)
                });
            });
        }
    }
    else {
        return res.status(400).send("Please fill out the form!");
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
                userJSON = {'user': username };
                return res.send({
                    msg: username + " Login Succeed!",
                    token: jwtSignUser(userJSON)
                });
            }
        });
    }
    else {
        return res.status(400).send("Please fill out the form!");
    }
}