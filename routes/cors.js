const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [
    'http://localhost:3000',
    'https://localhost:3443',
    'https://meet.google.com/',
    'chrome-extension://iijkadhmjmmnpgajhleiailnmfajgkji',
];

var corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    console.log(req.header('Origin'));
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true,
            optionsSuccessStatus: 200,
            credentials: true,
        };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
