const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const Students = require('../models/students');
const Subjects = require('../models/subjects');
const Attendance = require('../models/attendance');

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
    Attendance.findOneAndDelete(req.query)
    .then((attn) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(attn);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = attnRouter;


