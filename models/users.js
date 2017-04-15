var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var user = new Schema({
    username:{
        type: String,
        index: true
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    profileimage: {
        type: String,
    },

});
var user = mongoose.model('user', user);
module.exports = user;

module.exports.createUser= function (newUser, callback){
    newUser.save(callback);
}

