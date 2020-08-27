const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const Subjects = require('../models/subjects');
const Students = require('../models/students');
const Users = require('../models/user');
const { isAuth } = require('./authMiddleware');

const subjectRouter = express.Router();

subjectRouter.route('/')
.get(isAuth,(req,res,next) => {
    Subjects.find(req.query)
    .then((subjects) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subjects);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(isAuth,(req,res,next) => {
    Subjects.create(req.body)
    .then((subject) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subject);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(isAuth,(req, res, next) => {
    Subjects.deleteMany(req.query)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

subjectRouter.route('/:subjectId')
.get(isAuth,(req,res,next) => {
    Subjects.findById(req.params.subjectId)
    .then((subjects) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subjects);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(isAuth,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /subjects/'+ req.params.subjectId);
})
.put(isAuth,(req,res,next) => {
    Subjects.findByIdAndUpdate(req.params.subjectId, {
        $set: req.body
    }, { new: true})
    .then((subjects) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subjects);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(isAuth,(req,res,next) => {
    Subjects.findById(req.params.subjectId)
    .then(subject => 
        subject.remove()
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }), (err) => next(err))
    .catch((err) => next(err));
});

subjectRouter.route('/:subjectId/students')
.get(isAuth,(req,res,next) => {
    Subjects.findById(req.params.subjectId)
    .populate('students')
    .exec((err, students) => {
        if(err) next(err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(students);  
    })
})
.post(isAuth,(req,res,next) => {
    Subjects.update(
        { _id: req.params.subjectId },
        { $addToSet: { students: req.body } }
     )
    .then(subject => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subject); 
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(isAuth,(req,res,next) => {
    Subjects.update(
        { _id: req.params.subjectId },
        { $pull: { students: req.body } }
     )
    .then(subject => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subject); 
    }, (err) => next(err))
    .catch((err) => next(err));
})


subjectRouter.route('/:subjectId/shared')
.get(isAuth,(req,res,next) => {
    Subjects.findById(req.params.subjectId)
    .populate('sharedWith')
    .exec((err, subject) => {
        if(err) next(err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subject);  
    })
})
.post(isAuth,(req,res,next) => {
    Subjects.findByIdAndUpdate(
        req.params.subjectId ,
        { $addToSet: { sharedWith: req.body } },
        { new : true}
    )
    .then(subject => subject.model('User')
            .updateMany({'_id' : { $in : subject.sharedWith}},  {$addToSet:  { sharedSubjects: subject._id }} )    
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response); 
            }, (err) => next(err)))
    .catch((err) => next(err));
})
.delete(isAuth,(req,res,next) => {
    Subjects.findByIdAndUpdate(
        req.params.subjectId ,
        { $pull: { sharedWith: req.body } }
    )
    .then(subject => subject.model('User')
            .updateMany({'_id' : { $in : subject.sharedWith}},  {$pull:  { sharedSubjects: subject._id }} )    
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response); 
            }, (err) => next(err)))
    .catch((err) => next(err));
})


module.exports = subjectRouter;