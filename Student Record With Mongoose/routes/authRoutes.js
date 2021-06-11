const express = require('express');
const { body } = require('express-validator');

const authControllers = require('../controllers/authControllers');

const router = express.Router();

// AUTH-ROUTES

router.get('/profile', authControllers.getProfile);
router.get('/signup', authControllers.getSignup);
router.post('/signup', [
    body('email').trim().normalizeEmail().isEmail().withMessage('Invalid Email'),
    body('password').trim().isStrongPassword().withMessage('Please Choose Strong Password'),
    body(['cpassword']).trim().custom((value, {req}) => {
        if(value != req.body.password){
            return Promise.reject('Passwords Didn\'t Match')
        }
        return true;
    }) 
    ] , authControllers.postSignup);
router.get('/login', authControllers.getLogin);
router.post('/login', [ 
    body('email').trim().normalizeEmail().isEmail().withMessage('Invalid Email'),
    body('password').trim(),

    ] , authControllers.postLogin);
router.post('/logout', authControllers.postLogout);

module.exports = router;