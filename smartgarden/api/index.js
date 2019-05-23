var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');
var cors = require('cors');
var fs = require('fs');

fs.writeFile(__dirname + 'debug.log', 'Log:\n', function(err){});

var app = express();

require('./user.model');
var userModel = mongoose.model('user');

require('./garden.model');
var gardenModel = mongoose.model('garden');

var dbUrl = "mongodb://localhost:27017";
app.set('dbUrl', dbUrl);
mongoose.connect(dbUrl);

mongoose.connection.on('connected', function() {
    console.log('db connected');
});

mongoose.connection.on('error', function(error) {
    console.log('error', error);
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors());

passport.use('local', new LocalStrategy.Strategy(function(
    username, password, done) {
        userModel.findOne({username: username}, function(error, user) {
            if(!user || error) {
                return done(error, false);
            } else {
                user.comparePasswords(password, function(err, isMatch) {
                    if(err || !isMatch) return done(err, false);
                    return done(null, user.username);
                })
            }
        })
    }));

passport.serializeUser(function(username, done) {
    return done(null, username);
});

passport.deserializeUser(function(username, done) {
    return done(null, username);
});

app.use(expressSession({secret: '123456ezegyelrefijheigeihgieajhgijheaighiea'}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes'));

app.listen(5000, function() {
    console.log('app is listening');
});