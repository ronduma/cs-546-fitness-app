const express = require('express');
const router = express.Router();
const helpers = require('../helpers');
const users = require('../data/users');
const stats = require('../data/statsDiagram');

// router.get('/', async (req,res) => {
//     if(req.session.user){
//         return res.status(200).render('statsDiagram')
//     }
//     else{
//         return res.redirect('./login');
//     }
// });

router.get('/', async (req, res) =>{

    if(req.session.user){
        let option1 = "BodyGroup Graph";
        let option2 = "Excercise Progress";

        return res.status(200).render('statsScroll',  {
            title: "Sign Up \• Jimbro",
            message: "Stats Scroll wheel",
            session: req.session.user,
            option1: option1,
            option2: option2
        });
    }
    else{
        return res.redirect('./login');
    }
});
//post
router.post('/', async (req,res) => {
    let search = req.body;
    search = search.scroll;
    if(search === "BodyGroup Ratio"){
        let user = await users.getUserByUsername(req.session.user);
        let userId = user._id;
        let upper = await stats.upperData(userId);
        let core  = await stats.coreData(userId);
        let lower = await stats.lowerData(userId);

        
        let upper_percentage = (upper.length / (upper.length + core.length + lower.length)) * 100;
        let core_percentage = (core.length / (upper.length + core.length + lower.length)) * 100 ;
        let lower_percentage = (lower.length / (upper.length + core.length + lower.length)) * 100;
        
        let total = upper.length + core.length + lower.length;
        let isEmpty = false;

        if(total === 0){
            isEmpty = true;
        }

        return res.status(200).render('BodyGroup', {
            title: "Sign Up \• Jimbro",
            message: req.session.user + " Diagram",
            session: req.session.user,
            upper_per: upper_percentage,
            isEmpty: isEmpty,
            core_per: core_percentage,
            lower_per: lower_percentage,

        });
    }
    else if(search === "Workout Progress"){
        let current = await users.getUserByUsername(req.session.user);
        let lst = await stats.getAllExcercise(current._id);
        let result = [];
        for(let i = 0; i < lst.length; i++){
            result.push(lst[i].name);
        }
        return res.status(200).render('WorkoutProgress', {
            title: "Sign Up \• Jimbro",
            message: "Pick progress",
            session: req.session.user,
            list: result
        });
    }
    else{
        return res.redirect('./login');
    }
});

router.post('/workoutProgress', async (req,res) => {
    let search = req.body;
    search = search.scroll;

    //console.log(search);
    let current = await users.getUserByUsername(req.session.user);
    let current_data = await stats.getWeights(current._id, search);
    let current_days = await stats.getDays(current._id, search);
    //console.log(current_data);

    return res.status(200).render('workoutGraph', {
        title: "Sign Up \• Jimbro",
        message: req.session.user + " " + search + " weight progress",
        session: req.session.user,
        legend: current_days,
        data: current_data
    });
});

module.exports = router;