const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentName : {
        type: String,
        required: true
    },
    studentFather : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    department : {
        type: String,
        required: true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref :  'User'
    }
})

module.exports = mongoose.model('Student', studentSchema);






// const Sequelize = require('sequelize');

// const sequelize = require('../database');

// const student = sequelize.define('student', {
//     id : {
//         type : Sequelize.INTEGER,
//         autoIncrement : true,
//         allowNull : false,
//         primaryKey : true
//     },
//     'Student Name' : {
//         type : Sequelize.STRING,
//         allowNull : false
//     },
//     'Father Name' : {
//         type : Sequelize.STRING,
//         allowNull : false
//     },
//     'Email Address' : {
//         type : Sequelize.STRING,
//         allowNull : false
//     },
//     Department : {
//         type : Sequelize.STRING,
//         allowNull : false
//     }
// });

// module.exports = student;

