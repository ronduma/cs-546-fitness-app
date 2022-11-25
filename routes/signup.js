const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    return res.status(200).render('signup', {
        title : "Sign Up \• Jimbro",
        message : "this is the signup page lol"
    });
});

router.post('/', async (req, res) => {
    let signupData = req.body;
    try{
        console.log(signupData);
    } catch(e){
        return 
    }
});

module.exports = router;