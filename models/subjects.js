const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true
    },
    students : [{ type: Schema.Types.ObjectId, ref: 'Student' }]
});

const Subjects = mongoose.model('Subject', subjectSchema);

module.exports = Subjects;