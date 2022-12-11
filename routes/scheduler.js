const express = require('express');
const { workouts, users } = require('../data');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const workoutData = data.workouts;
const helpers = require('../helpers');

router.get('/', async (req, res) => {
    if(req.session.user){
        res.status(200).render('scheduler', {
            title : "Scheduler \• Jimbro",
            message : "Welcome to the Workout Scheduler Page!",
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

router.get('/preset', async (req,res) => {
    if(req.session.user){
        //Get all the available workouts
        const allWorkouts = await workoutData.getAllWorkouts();
        const options = [];
        allWorkouts.forEach(elem => options.push(elem.name));
        res.status(200).render('schedulerPreset', {
            title : "Scheduler \• Jimbro",
            message : "Welcome to the Workout Scheduler Preset Page!",
            session : req.session.user,
            options: options
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

router.post('/preset', async (req,res) => {
    if(req.session.user){
        try{
            req.body.sampleWorkoutName = helpers.checkString(req.body.sampleWorkoutName, 'Sample Workout Name');
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
            const thisWorkout = await workoutData.getWorkoutByName(req.body.sampleWorkoutName);
            const thisUser = await users.getUserByUsername(req.session.user);
            const userId = thisUser._id;
            const dayOfWeek = req.body.dayOfWeek;
            for(let i=0; i< thisWorkout.workout.length; i++){
                const exerciseName = thisWorkout.workout[i].exercise;
                const exerciseWeight = thisWorkout.workout[i].weight;
                const numSets = thisWorkout.workout[i].sets;
                const numReps = thisWorkout.workout[i].reps;
                await userData.addExercise(userId, exerciseName, exerciseWeight, numSets, numReps, dayOfWeek);
            }
            res.status(200).render('scheduler', {
                title: 'Scheduler \• Jimbro',
                message: `${thisWorkout.name} has been added successfully!`,
                session: req.session.user
            });
        }catch(e){
            res.status(500).render('scheduler', {
                title: 'Scheduler \• Jimbro',
                message: e,
                session: req.session.user
            })
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

router.get('/schedule', async (req,res) => {
    if(req.session.user){
        const thisUser = await users.getUserByUsername(req.session.user);
        let lists = {
            mondayList: {dayPlanned: 'Monday', list: []},
            tuesdayList: {dayPlanned: 'Tuesday', list: []},
            wednesdayList: {dayPlanned: 'Wednesday', list: []},
            thursdayList: {dayPlanned: 'Thursday', list: []},
            fridayList: {dayPlanned: 'Friday', list: []},
            saturdayList: {dayPlanned: 'Saturday', list: []},
            sundayList: {dayPlanned: 'Sunday', list: []},
        }
        thisUser.workoutRoutine.forEach(elem => {
            if (elem.dayPlanned === 'Monday') lists.mondayList.list.push(elem)
            else if(elem.dayPlanned === 'Tuesday') lists.tuesdayList.list.push(elem)
            else if(elem.dayPlanned === 'Wednesday') lists.wednesdayList.list.push(elem)
            else if(elem.dayPlanned === 'Thursday') lists.thursdayList.list.push(elem)
            else if(elem.dayPlanned === 'Friday') lists.fridayList.list.push(elem)
            else if(elem.dayPlanned === 'Saturday') lists.saturdayList.list.push(elem)
            else if(elem.dayPlanned === 'Sunday') lists.sundayList.list.push(elem)
        })
        res.status(200).render('schedule', {
            title: 'Scheduler \• Jimbro',
            message: `Here is your schedule for this week`,
            session: req.session.user,
            lists: lists
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
module.exports = router;