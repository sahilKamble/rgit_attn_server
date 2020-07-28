const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const Subjects = require('../models/subjects');

const subjectRouter = express.Router();

subjectRouter.route('/')
.get((req,res,next) => {
    Subjects.find(req.query)
    .then((subjects) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subjects);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req,res,next) => {
    Subjects.create(req.body)
    .then((subject) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subject);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Subjects.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

subjectRouter.route('/:subjectId')
.get((req,res,next) => {
    Subjects.findById(req.params.subjectsId)
    .then((subjects) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subjects);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /subjects/'+ req.params.subjectsId);
})
.put((req,res,next) => {
    Subjects.findByIdAndUpdate(req.params.subjectsId, {
        $set: req.body
    }, { new: true})
    .then((subjects) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(subjects);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Subjects.findOneAndDelete(req.params.subjectsId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = subjectRouter;