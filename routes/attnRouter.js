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

attnRouter.route('/sub/:subid/:studid')
.get((req,res,next) => {
    Attendance.find({
        subject: req.params.subid,
        student: req.params.studid
    })
    .sort({date : 1})
    .select('present date')
    .exec((err, attn) => {
        if (err) next(err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(attn);
    })
})

attnRouter.route('/table/:subid')
.get(async (req,res,next) => {
    Subjects.findById(req.params.subid)
    .exec((err, subject) => {
        if(err) next(err);
        Attendance.aggregate([
            {$match: {student:{$in:subject.students}, subject: subject._id}},
            {$sort: {'date': 1}},
            {
                $group:
                {
                    '_id': '$student',
                    'attn': {
                        $push: '$$ROOT'
                    }
                }
            },
            {
                $lookup: {
                    'from' : 'students',
                    'localField' : '_id',
                    'foreignField' : '_id',
                    'as' : 'student' 
                }
            },
            {
                $unwind : '$student'
            },
            {
                $sort:{'student.roll':1}
            }
        ])
        .then(docs => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(docs);
        }, err => next(err)) 
        .catch((err) => next(err));
    })
})

module.exports = attnRouter;


