const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attnSchema = new Schema({
    date:  { type: Date, default: Date.now },
    student : { type: Schema.Types.ObjectId, ref: 'Student' },
    subject : { type: Schema.Types.ObjectId, ref: 'Subject' },
    present : { type: Boolean, default: true}
})

const Attendance = mongoose.model('Attendance', attnSchema);

module.exports = Attendance;