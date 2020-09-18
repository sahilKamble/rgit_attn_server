const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
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

studentSchema.index({ year: 1, roll: 1, div: 1, dept: 1 }, { unique: true });

const Students = mongoose.model('Student', studentSchema);
Students.syncIndexes();
module.exports = Students;