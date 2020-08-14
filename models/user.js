const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
const Subjects = require('./subjects');

var User = new Schema({
    admin: {
        type: Boolean,
        default: false
    },
    subjects: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Subject' 
    }],
});

User.plugin(passportLocalMongoose);

User.post('remove', function(next) {
    var user = this;
    // var subjects = user.subjects;
    console.log(this)
    user.model('Subject')
    .remove({_id : {$in : user.subjects}})
    .then(next)
});

const Users = mongoose.model('User', User);

module.exports = Users;