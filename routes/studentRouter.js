const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const Students = require('../models/students');
const Subjects = require('../models/subjects');

const studentRouter = express.Router();

studentRouter.use(bodyParser.json());

//to do: on delete, delete ref from subject

studentRouter.route('/')
.get((req,res,next) => {
    Students.find(req.query)
    .then((students) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(students);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    const student = new Students({
        name : req.body.name,
        roll : req.body.roll,
        div : req.body.div,
        dept : req.body.dept,
    });
    Students.create(student)
    .then(student => {
        for (subject of req.body.subject)
        {
            Subjects.findById(subject)
            .then(sub => {
                sub.students.push(student);
                sub.save();
            })
        }
        return student;
    }, err => next(err))
    .then((student) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(student);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /students');
})
.delete((req, res, next) => {
    Students.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));  
})

studentRouter.route('/:studentId')
.get((req,res,next) => {
    Students.findById(req.params.studentId)
    .then((student) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(student);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /students/'+ req.params.studentId);
})
.put((req,res,next) => {
    Students.findByIdAndUpdate(req.params.studentId, {
        $set: req.body
    }, { new: true})
    .then((student) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(student);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Students.findOneAndDelete(req.params.studentId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = studentRouter;