var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var fs = require('fs');
var util = require('util');
var userModel = mongoose.model('user');
var gardenModel = mongoose.model('garden');
var router = express.Router();

router.post('/register', function(req, res) {
    if(req.body.username && req.body.password) {
        var user = new userModel({
            username: req.body.username,
            password: req.body.password
        });
        user.save(function(error) {
            if(error) { 
                fs.appendFile(__dirname + 'debug.log', util.format("Register failed.\n"), function(err){});
                return res.status(500).send(error);
            }
            fs.appendFile(__dirname + 'debug.log', util.format("Register succeed.\n"), function(err){});
            return res.status(200).send("registration success");
        })
    } else {
        fs.appendFile(__dirname + 'debug.log', util.format("Register failed.\n"), function(err){});
        return res.status(404).send("username or password is missing");
    }
});

router.post('/login', function(req, res) {
    passport.authenticate('local', function(error, username){
        if(error) {
            fs.appendFile(__dirname + 'debug.log', util.format("Login failed.\n"), function(err){});
            return res.status(403).send(error);
        } else {
            req.logIn(username, function(error) {
                if(error) {
                    fs.appendFile(__dirname + 'debug.log', util.format("Login failed.\n"), function(err){});
                    return res.status(500).send("Serialization error");
                } else {
                    fs.appendFile(__dirname + 'debug.log', util.format("Login succeed.\n"), function(err){});
                    return res.status(200).send("Welcome");
                }
            });
        }
    })(req, res);
});

router.get('/logout', function(req, res) {
    if(req.isAuthenticated()) {
        req.logout();
        fs.appendFile(__dirname + 'debug.log', util.format("Logout succeed.\n"), function(err){});
        return res.status(200).send("logout successful");
    }
    return res.status(403).send("log in first");
    

});

router.post('/addgarden', function(req, res) {
    if (req.isAuthenticated()) {
        if(req.body.gardename && req.body.username && req.body.height && req.body.width && req.body.temperature && req.body.humidity) {
            var garden = new gardenModel({
                gardename: req.body.gardename,
                username: req.body.username,
                height: req.body.height,
                width: req.body.width,
                temperature: req.body.temperature,
                humidity: req.body.humidity
            });
            garden.save(function(error) {
                if(error) {
                    fs.appendFile(__dirname + 'debug.log', util.format("Garden registration failed.\n"), function(err){});
                    return res.status(500).send(error);
                }
                fs.appendFile(__dirname + 'debug.log', util.format("Garden registration succeed.\n"), function(err){});
                return res.status(200).send("garden registration success");
            })
        } else {
            fs.appendFile(__dirname + 'debug.log', util.format("Garden registration failed.\n"), function(err){});
            return res.status(404).send("missing information");
        }
    }
    else
    {
        return res.status(403).send("you have no access");
    }
});

router.get('/getgarden', function(req, res) {
    if (req.isAuthenticated()) {
        if (req.query.username) {
            gardenModel.find().where("username", req.query.username).exec(function(err, result) {
                fs.appendFile(__dirname + 'debug.log', util.format("Getgarden succeed.\n"), function(err){});
                return res.status(200).send(result);
            });
        }
        else
        {
            fs.appendFile(__dirname + 'debug.log', util.format("Getgarden failed.\n"), function(err){});
            return res.status(404).send("missing information");
        }
    }
    else
    {
        return res.status(403).send("you have no access");
    }
});

router.get('/settemperature', function(req, res)
{
    if (req.isAuthenticated()) {
        if (req.query.username && req.query.gardename && req.query.temperature) {

            gardenModel.update({ username: req.query.username, gardename: req.query.gardename }, { $set : { temperature: req.query.temperature } }).exec();
            fs.appendFile(__dirname + 'debug.log', util.format("Settemperature succeed.\n"), function(err){});
            return res.status(200).send("temperature updated");
        }
        else
        {
            fs.appendFile(__dirname + 'debug.log', util.format("Settemperature failed.\n"), function(err){});
            return res.status(404).send("missing information");
        }
    }
    else
    {
        return res.status(403).send("you have no access");
    }
});

router.get('/sethumidity', function(req, res)
{
    if (req.isAuthenticated()) {
        if (req.query.username && req.query.gardename && req.query.humidity) {

            gardenModel.update({ username: req.query.username, gardename: req.query.gardename }, { $set : { humidity: req.query.humidity } }).exec();
            fs.appendFile(__dirname + 'debug.log', util.format("Sethumidity succeed.\n"), function(err){});
            return res.status(200).send("humidity updated.");
        }
        else
        {
            fs.appendFile(__dirname + 'debug.log', util.format("Sethumidity failed.\n"), function(err){});
            return res.status(404).send("missing information");
        }
    }
    else
    {
        return res.status(403).send("you have no access");
    }
});

module.exports = router;