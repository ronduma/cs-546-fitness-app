const express = require('express');
const router = express.Router();
const helpers = require('../helpers');
const users = require('../data/users');
const stats = require('../data/statsDiagram');

router.get('/', async (req,res) => {
    if(req.session.user){
        return res.status(200).render('statsDiagram')
    }
    else{
        return res.redirect('./login');
    }
});
router.get('/bodygroup', async (req,res) => {
    if(req.session.user){
        let user = await users.getUserByUsername(req.session.user);
        let userId = user._id;
        let upper = await stats.upperData(userId);
        let core  = await stats.coreData(userId);
        let lower = await stats.lowerData(userId);
        
        let upper_percentage = (upper.length / (upper.length + core.length + lower.length)) * 100;
        let core_percentage = (core.length / (upper.length + core.length + lower.length)) * 100 ;
        let lower_percentage = (lower.length / (upper.length + core.length + lower.length)) * 100;
        

        return res.status(200).render('statsDiagram', {
            title: "Sign Up \• Jimbro",
            message: req.session.user + " Diagram",
            session: req.session.user,
            upper_per: upper_percentage,
            core_per: core_percentage,
            lower_per: lower_percentage,

        });
    }
    else{
        return res.redirect('./login');
    }
});

module.exports = router;