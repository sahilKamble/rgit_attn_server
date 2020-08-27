const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')

const subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    sharedWith: [{
        type: Schema.Types.ObjectId, 
        ref: 'User',
       
    }],
    students : [{ type: Schema.Types.ObjectId, ref: 'Student' }]
});

subjectSchema.post('remove', function(next) {
    var subject = this;
    console.log(this)
    subject.model('User')
    .findByIdAndUpdate(subject.teacher, {$pull:  { subjects: subject._id }})
    .then( subject.model('User')
            .updateMany({'_id' : { $in : subject.sharedWith}},  {$pull:  { sharedSubjects: subject._id }} )    
            .then(next)
    )
   
});

subjectSchema.post('save', function(next) {
    var subject = this;
    subject.model('User')
    .findByIdAndUpdate(subject.teacher, {$push:  { subjects: subject._id }})
    .then(next)
});

const Subjects = mongoose.model('Subject', subjectSchema);

module.exports = Subjects;