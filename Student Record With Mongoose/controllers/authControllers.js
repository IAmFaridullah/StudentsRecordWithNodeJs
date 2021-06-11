const User = require('../models/users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

var api_key = '837c2bb15a5c522e48ba6c0e2bd20303-2a9a428a-1d95b203';
var domain = 'sandbox3085fad4d68a442d940876d5fadef9ee.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 

// CONTROLLERS

exports.getProfile = ( req, res ) => {
    res.render('pages/profile', {
        user : req.session.user
    })
}


exports.getSignup = (req, res) => {
    res.render('pages/signup', {
        errorMessage : req.flash('error'),
        validationErrors : [],
        oldInputs : {
            fname : "",
            email : "",
            password : "",
            cpassword : ""
        }
    });
}

exports.postSignup = (req, res) => {
    const { fname, email , password, cpassword } = req.body;
    const imagePathArray = req.file.path.split('\\');
    imagePathArray.shift();
    const imagePath = imagePathArray.join('/')
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.render('pages/signup', {
        errorMessage : req.flash('error'),
            errorMsg : errors.array()[0].msg,
            validationErrors : errors.array(),
            oldInputs : {
                fname,
                email,
                password,
                cpassword
            }
        })
    }
    User.findOne({email: email})
        .then(user => {
           if(!user){
            bcrypt.hash(password, 10)
            .then(hashedPassword => {
      const user = new User({
          fullName : fname,
          email : email,
          imagePath : imagePath,
          password: hashedPassword
      })
      user.save()
      .then(() => {
        req.flash('success', 'Account created successfully')
        req.session.save(err => {
            res.redirect('/login');
        })
        
        // var data = {
        //     from: 'NodeApp <faridullahkhan645@gmail.com>',
        //     to: 'techspot456@gmail.com',
        //     subject: 'Account Created!',
        //     html: `<b>hello ${fname}</b><br/> your account has beeen successfully created.`
        //   };
        // mailgun.messages().send(data, function (error, body) {
        //     console.log(body);
        //   });
      })
      .catch(err => console.log(err))

    })
    .catch(err => console.log(err))

  }else{
            req.flash('error', 'Email Is Already Registered')
            req.session.save(err => {
                res.redirect('/signup');
            })
        }})
           .catch(err => console.log(err))
    }
        
exports.getLogin = (req, res) => {
    if(req.session.isLoggedIn){
        res.redirect('/');
    }
    res.render('pages/login', {
        successMessage : req.flash('success'),
        errorMessage : req.flash('error'),
        pCssStyle : req.flash('passwordCss'),
        eCssStyle : req.flash('emailCss'),
        loginEmailInput : req.flash('loginEmail'),
        loginPasswordInput : req.flash('loginPassword'),
        validationErrors : [],
        oldInputs : {
            email : "",
            password : ""
    }
})
}

exports.postLogin = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.render('pages/login', {
        successMessage : req.flash('success'),
        errorMessage : req.flash('error'),
        pCssStyle : req.flash('passwordCss'),
        eCssStyle : req.flash('emailCss'),
        loginEmailInput : req.flash('loginEmail'),
        loginPasswordInput : req.flash('loginPassword'),
            errorMsg : errors.array()[0].msg,
            validationErrors : errors.array(),
            oldInputs : {
                email,
                password
            }
        })
    }
    User.findOne({ email: email})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password)
                  .then(domatch => {
                    if(domatch){
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        req.session.save(err => {
                            if(err){
                                console.log(err)
                            }
                            res.redirect('/');
                        })
                    }else{
                        req.flash('error', 'Password Is Incorrect');
                        req.flash('passwordCss', 'problem' )
                        req.flash('loginEmail', email )
                        req.flash('loginPassword', password )
                        req.session.save(() => {
                            res.redirect('/login')
                        })
                    }
                  })
                  .catch(err => console.log(err));
        }else{
            req.flash('error', 'Email Is Not Registerd');
            req.flash('emailCss', 'problem' )
            req.flash('loginEmail', req.body.email ) 
            req.flash('loginPassword', req.body.password )
            req.session.save(() => {
                res.redirect('/login')
            })
        }
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}