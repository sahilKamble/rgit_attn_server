const express = require('express');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');

const Absentees = require('../models/absentees');
const Subjects = require('../models/subjects');

const absenteeRouter = express.Router();


function dataSorter(data) {

    function checkdate(date, list) {
        
        for(abs_date of list){
            if (date.getTime() === abs_date.getTime())
            return true;
        }
        return false;
    }
    
    var n_data = {};
    var dates = new Set();
    for(stu of data.students) {
        n_data[stu._id] = {div: stu.div ,roll: stu.roll,name: stu.name,abs: [], attn: []}     
    }
    for(abslist of data.abs) {
        dates.add(abslist.date);
        for(stuid of abslist.absentStudents) {
            const id = stuid.toString()
            //n_data.id.abs.push(abslist.date)
            if (n_data[id] != null)
                n_data[id].abs.push(abslist.date);
        }
    }
    for(stu in n_data) {
        for(date of dates) {
            if(checkdate(date,n_data[stu].abs)) n_data[stu].attn.push("A");
            else n_data[stu].attn.push("P");
        }
    }
    var date_arr = Array.from(dates);
    n_data["dates"] = date_arr;
    return n_data
}

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
    Absentees.findOneAndDelete(req.params.studentId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

absenteeRouter.route('/sub/:subid')
.get((req,res,next) => {
    Absentees.find({
        subject : req.params.subid
    })
    .sort({date : 1})
    .exec(function (err, absentees) {
        if (err)  next(err);
        Subjects.findById(req.params.subid)
        .populate('students')
        .sort("students.div students.roll")
        .exec(function (err, sub) {
            if (err)  next(err);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            var data = {
                abs : absentees,
                students : sub.students
            }
            var resp = dataSorter(data)
            res.json(resp);
            // res.json(data)
        })
    })
})
.delete((req,res,next) => {
    Absentees.deleteMany({subject : req.params.subid})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = absenteeRouter;