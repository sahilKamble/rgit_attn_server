const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String
});

const Users = mongoose.model('User', UserSchema);

module.exports = Users;