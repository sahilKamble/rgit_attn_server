const express = require('express');
const Students = require('../../models/subjects');
const Subjects = require('../../models/subjects');

Subjects.find({})
.then(students => console.log(students));