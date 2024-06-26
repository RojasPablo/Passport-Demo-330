const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String},
    googleId: {type: String},
    thumbnail: {type: String}
})

module.exports = mongoose.model('user', userSchema)