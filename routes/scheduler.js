const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const scheduler = data.scheduler;
const path = require('path');
const helpers = require('../helpers');

router.get('/', async (req, res) => {
    if(req.session.user){
        res.status(200).render('scheduler', {
            title : "Scheduler \• Jimbro",
            message : "this is the scheduler page",
            session : req.session.user
        });
    }
    else{
        res.status(200).render('login', {
            title : "Log In \• Jimbro",
            message : "You need to log in to use the Scheduler",
            session : req.session.user
        });
    }
});

router.post('/', async (req,res) => {
    if(req.session.user){
        try{
            req.body.exerciseName = helpers.checkString(req.body.exerciseName, 'Exercise Name');
            req.body.exerciseWeight = helpers.checkPosNum(parseInt(req.body.exerciseWeight), 'Exercise Weight');
            req.body.numSets = helpers.checkPosNum(parseInt(req.body.numSets), 'Number of Sets');
            req.body.numReps = helpers.checkPosNum(parseInt(req.body.numReps), 'Number of Reps');
            req.body.dayOfWeek = helpers.checkDay(req.body.dayOfWeek);
        }catch(e){
            res.status(400).render('scheduler', {
                title: 'Scheduler \• Jimbro',
                message: e,
                session: req.session.user
            });
            return;
        }
        try{
            const thisUser = await userData.getUserByUsername(req.session.user);
            const userId = thisUser._id;
            await userData.addExercise(userId, req.body.exerciseName, req.body.exerciseWeight, req.body.numSets, req.body.numReps, req.body.dayOfWeek);
            res.status(200).render('scheduler', {
                title: 'Scheduler \• Jimbro',
                message: 'Exercise successfully added',
                session: req.session.user
            });
        }catch(e){
            res.status(500).render('scheduler', {
                title: 'Scheduler \• Jimbro',
                message: e,
                session: req.session.user
            });
        }
    }
    else{
        res.status(200).render('login', {
            title : "Log In \• Jimbro",
            message : "You need to log in to use the Scheduler",
            session : req.session.user
        });
    }
});
module.exports = router;