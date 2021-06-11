const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    imagePath : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    students : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student'
    }]
})

module.exports = mongoose.model('User', userSchema);


