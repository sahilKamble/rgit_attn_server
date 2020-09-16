const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    roll: {
        type: Number,
        required: true
    },
    div: {
        type: String,
        required: true
    },
    dept: {
        type: String
    }
}, { timestamps: true });

const Students = mongoose.model('Student', studentSchema);

module.exports = Students;