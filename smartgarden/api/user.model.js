var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, lowercase: true},
    password: {type: String}
}, {collection: 'user'});

userSchema.pre('save', function(next) {
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(10, function(error, salt) {
            if(error) {
                return next(error);
            }
            bcrypt.hash(user.password, salt, function(error, hash) {
                if(error) {
                    return next(error);
                }
                user.password = hash;
                return next();
            })
        })
    } else {
        return next();
    }
});

userSchema.methods.comparePasswords = function(password, next) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        return next(error, isMatch);
    })
};

mongoose.model('user', userSchema);

var mongoose = require('mongoose');

var gardenSchema = new mongoose.Schema({
    gardename: {type: String, unique: true, lowercase: true},
    username: { type: String },
    height: { type: Number },
    width: { type: Number },
    temperature: { type: Number },
    humidity: { type: Number }
}, {collection: 'garden'});

mongoose.model('garden', gardenSchema);