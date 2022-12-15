const express = require('express');
const router = express.Router();
const helpers = require('../helpers');
const users = require('../data/users');


router.get('/', async (req,res) => {
    if(req.session.user){
        return res.redirect('protected');
    }
    else{
        return res.status(200).render('statsDiagram', {
            title: "Sign Up \• Jimbro",
            message: "Stats Diagram",
            session: req.session.user
        });
    }
});

router.post('/', async)