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
.get((req,res,next) => {
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
                        $push: { _id: "$_id", present: "$present", date: "$date" }
                        //$push: '$$ROOT'
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
                $sort:{'student.roll':1 }
            },
            {
                $sort:{'student.div':1}
            },
            {
                $project: { 'student.roll' : 1, 'student.name' : 1, 'student.div' : 1, 'attn':1}
            }
        ])
        .then(docs => {
            if(docs.length == 0) {
                Subjects.aggregate([
                    {
                        $match: {_id: subject._id}
                    },
                    {
                        $unwind : '$students'
                    },
                    {
                        $lookup: {
                            'from' : 'students',
                            'localField' : 'students',
                            'foreignField' : '_id',
                            'as' : 'student' 
                        }
                    },
                    {
                        $project: { 'student.roll' : 1, 'student.name' : 1, 'student.div' : 1, 'student._id':1, '_id':0}
                    },
                    {
                        $unwind : '$student'
                    },
                    {
                        $sort:{'student.roll':1 }
                    },
                    {
                        $sort:{'student.div':1}
                    },
                ])
                .then(docs => {
                    for(student of docs) {
                        student["attn"] = [];
                        student["_id"] = student.student._id
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(docs);
                })
            }
        else {
            console.log('here2')
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(docs);
        }}, err => next(err)) 
        .catch((err) => next(err));
    })
})

module.exports = attnRouter;


