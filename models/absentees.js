const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const absenteeSchema = new Schema({
    date:  { type: Date, default: Date.now },
    absentStudents : [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    subject : { type: Schema.Types.ObjectId, ref: 'Subject' },
})

const Absentees = mongoose.model('Absentee', absenteeSchema);

module.exports = Absentees;