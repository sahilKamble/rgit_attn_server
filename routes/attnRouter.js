const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const Students = require('../models/students');
const Subjects = require('../models/subjects');
const Attendance = require('../models/attendance');
const { populate } = require('../models/students');

const attnRouter = express.Router();

attnRouter.route('/')
.get((req,res,next) => {
    Attendance.find(req.query)
    .then((attn) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(attn);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    Attendance.create(req.body)
    .then((attn) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(attn);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Attendance.deleteMany(req.query)
    .then((attn) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(attn);
    }, (err) => next(err))
    .catch((err) => next(err));
});

attnRouter.route('/table')
.get(async (req,res,next) => {
    const subject_q = await Subjects.findById(req.body.subid)
    .populate('students')
    .exec()
    var subject = subject_q.toJSON();
    subject.students.sort((a,b) => a.div - b.div );
    subject.students.sort((a,b) => a.roll - b.roll );
    var first = true
    for(student of subject.students) {
        var attns = await Attendance.find({
            subject: req.body.subid,
            student: student._id
        })
        .sort({date : 1})
        .exec()
        if(first) {
            subject.dates = []; 
            for (attn of attns) subject.dates.push(attn.date );
            first = false;
        }
        student["attn"] = [];
        for(attn of attns){
            if(attn.present) student["attn"].push("P");
            else student["attn"].push("A");
        }
    }


    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(subject);
})

module.exports = attnRouter;


