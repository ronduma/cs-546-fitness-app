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
        return res.status(200).render('bodyGroup', {
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
            if(!result.includes(lst[i].name)){
                result.push(lst[i].name);
            }
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
    
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let sus_days = [];
    let sus_data = [];
    for(let i =0; i < days.length; i++){
        for(let j = 0; j < current_data.length; j++){
            if(days[i] == current_data[j]["dayPlanned"]){
                sus_days.push(current_data[j]["dayPlanned"]);
                sus_data.push(current_data[j]["weight"]);
            }
        }
    }
    console.log(sus_data);
    console.log(sus_days);

    return res.status(200).render('workoutGraph', {
        title: "Sign Up \• Jimbro",
        message: req.session.user + " " + search + " weight progress",
        session: req.session.user,
        legend: sus_days,
        data: sus_data
    });
});

module.exports = router;