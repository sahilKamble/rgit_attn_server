const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const Absentees = require('../models/absentees');
const Subjects = require('../models/subjects');

const absenteeRouter = express.Router();

absenteeRouter.route('/')
.get((req,res,next) => {
    Absentees.find()
    .then((abs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(abs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Absentees.create(req.body)
    .then((abs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(abs);
    }, (err) => next(err))
    .catch((err) => next(err));
})

absenteeRouter.route('/:absid') 
.get((req,res,next) => {
    Absentees.findById(req.params.absid)
    .then((abs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(abs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    Absentees.findByIdAndUpdate(req.params.absid, {
        $set: req.body
    }, { new: true })
    .then((abs) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(abs);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) => {
    Absentees.findByIdAndRemove(req.params.absid)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

absenteeRouter.route('/sub/:subid')
.delete((req,res,next) => {
    Absentees.deleteMany({subject : req.params.subid})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

absenteeRouter.route('/table/:subid')
.get((req,res,next) => {
    Absentees.aggregate([
        {$match: {subject: mongoose.Types.ObjectId(req.params.subid)}},
        {$sort: {'date': 1}}
    ])
    .then(docs => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(docs);
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = absenteeRouter;