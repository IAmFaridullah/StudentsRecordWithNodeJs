const Student = require('../models/students');
const User = require('../models/users');

exports.getRecords = (req, res, next) => {    
    const userId = req.session.user._id   
        Student.find({user : userId})
               .then(students => {
                res.render('pages/index', {
                    students : students,
                    user : req.session.user,
                    id : 1,
                })
               }).catch(err => console.log(err))
}

exports.newStudent = (req, res, next) => {
    res.render('pages/newOrEditStudent', {
        user : req.session.user,
        editing : false,
    });
}

exports.editStudent = (req, res, next) => {
    Student.findById(req.params.id)
           .then(student => {
                res.render('pages/newOrEditStudent', {
                    user : req.session.user,
                    editing : true,
                    student : student,
                });
           })
    
}

exports.postNewStudent = (req, res, next) => {
    const userId = req.session.user._id;
    User.findById(userId)
        .then(user => {
            if(user){
                const student = new Student({
                    studentName: req.body.name,
                    studentFather: req.body.fname,
                    email: req.body.email,
                    department: req.body.dept,
                    user : user
                });
                
                student.save()
                 .then(() => {
                        user.students.push(student);
                        user.save()
                        .then(
                            res.redirect('/')
                        ).catch(err => console.log(err))
                })
                   .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
   }

exports.postUpdatedStudent = (req, res, next) => {
    Student.findById(req.body.id)
           .then(student => {
               student.studentName = req.body.name;
               student.studentFather = req.body.fname;
               student.email = req.body.email;
               student.department = req.body.dept;
               student.save().then(() => {
                res.redirect('/');
               }).catch(err => console.log(err))
           }).catch(err => console.log(err))
}

exports.deleteStudent = (req, res, next) => {
    Student.findByIdAndRemove(req.params.id)
           .then(() => {
                res.redirect('/');
           }).catch(err => {
               console.log(err)
           })
    
}