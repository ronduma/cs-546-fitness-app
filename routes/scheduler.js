const express = require('express');
const { workouts, users } = require('../data');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const workoutData = data.workouts;
const helpers = require('../helpers');
const xss = require('xss');

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
//Change this route to use AJAX
router.post('/', async (req,res) => {
    if(req.session.user){
        try{
            req.body.exerciseName = helpers.checkString(xss(req.body.exerciseName), 'Exercise Name');
            req.body.exerciseWeight = helpers.checkPosNum(parseInt(xss(req.body.exerciseWeight)), 'Exercise Weight');
            req.body.numSets = helpers.checkPosNum(parseInt(xss(req.body.numSets)), 'Number of Sets');
            req.body.numReps = helpers.checkPosNum(parseInt(xss(req.body.numReps)), 'Number of Reps');
            req.body.dayOfWeek = helpers.checkDay(xss(req.body.dayOfWeek));
            req.body.bodyGroup = helpers.checkBodyGroup(xss(req.body.bodyGroup));
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
            await userData.addExercise(userId, xss(req.body.exerciseName), xss(req.body.exerciseWeight), xss(req.body.numSets), xss(req.body.numReps), xss(req.body.dayOfWeek), xss(req.body.bodyGroup));
            res.status(200).render('scheduler', {
                title: 'Scheduler \• Jimbro',
                message: 'Exercise successfully added',
                session: req.session.user
            });
        }catch(e){
            res.status(200).render('scheduler', {
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
            req.body.sampleWorkoutName = helpers.checkString(xss(req.body.sampleWorkoutName), 'Sample Workout Name');
            req.body.dayOfWeek = helpers.checkDay(xss(req.body.dayOfWeek));
        }catch(e){
            res.status(400).render('scheduler', {
                title: 'Scheduler \• Jimbro',
                message: e,
                session: req.session.user
            });
            return;
        }
        try{
            const thisWorkout = await workoutData.getWorkoutByName(xss(req.body.sampleWorkoutName));
            const thisUser = await userData.getUserByUsername(req.session.user);
            const userId = thisUser._id;
            const dayOfWeek = xss(req.body.dayOfWeek);
            const bodyGroup = thisWorkout.bodyGroup;
            for(let i=0; i< thisWorkout.workout.length; i++){
                const exerciseName = thisWorkout.workout[i].exercise;
                const exerciseWeight = thisWorkout.workout[i].weight;
                const numSets = thisWorkout.workout[i].sets;
                const numReps = thisWorkout.workout[i].reps;
                await userData.addExercise(userId, exerciseName, exerciseWeight, numSets, numReps, dayOfWeek, bodyGroup);
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
        const thisUser = await userData.getUserByUsername(req.session.user);
        let lists = {
            mondayList: {dayPlanned: 'Monday', list: []},
            tuesdayList: {dayPlanned: 'Tuesday', list: []},
            wednesdayList: {dayPlanned: 'Wednesday', list: []},
            thursdayList: {dayPlanned: 'Thursday', list: []},
            fridayList: {dayPlanned: 'Friday', list: []},
            saturdayList: {dayPlanned: 'Saturday', list: []},
            sundayList: {dayPlanned: 'Sunday', list: []},
        }
        let bodySatisfying = {
            upperSatisfying: {bodyGroup: 'Upper Body', numSat: 0, currGoal: thisUser.bodyGroupGoals.upperGoal},
            lowerSatisfying: {bodyGroup: 'Lower Body', numSat: 0, currGoal: thisUser.bodyGroupGoals.lowerGoal},
            coreSatisfying: {bodyGroup: 'Core', numSat: 0, currGoal: thisUser.bodyGroupGoals.coreGoal}
        }
        thisUser.workoutRoutine.forEach(elem => {
            if (elem.dayPlanned === 'Monday') lists.mondayList.list.push(elem)
            else if(elem.dayPlanned === 'Tuesday') lists.tuesdayList.list.push(elem)
            else if(elem.dayPlanned === 'Wednesday') lists.wednesdayList.list.push(elem)
            else if(elem.dayPlanned === 'Thursday') lists.thursdayList.list.push(elem)
            else if(elem.dayPlanned === 'Friday') lists.fridayList.list.push(elem)
            else if(elem.dayPlanned === 'Saturday') lists.saturdayList.list.push(elem)
            else if(elem.dayPlanned === 'Sunday') lists.sundayList.list.push(elem)
            if(elem.bodyGroup === 'Upper Body') bodySatisfying.upperSatisfying.numSat++;
            else if(elem.bodyGroup === 'Lower Body') bodySatisfying.lowerSatisfying.numSat++;
            else if(elem.bodyGroup === 'Core') bodySatisfying.coreSatisfying.numSat++;
        })
        res.status(200).render('schedule', {
            title: 'Scheduler \• Jimbro',
            message: `Here is your schedule for this week`,
            session: req.session.user,
            lists: lists,
            bodySatisfying: bodySatisfying
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

router.get('/goals', async (req,res) => {
    if(req.session.user){
        const thisUser = await userData.getUserByUsername(req.session.user);
        res.status(200).render('goals', {
            title : "Scheduler \• Jimbro",
            message : "Here you can set or update your Body Group Weekly goals",
            session : req.session.user,
            goals: {
                upperGoal: {text: 'Upper Body', goal: thisUser.bodyGroupGoals.upperGoal},
                lowerGoal: {text: 'Lower Body', goal: thisUser.bodyGroupGoals.lowerGoal},
                coreGoal: {text: 'Core', goal: thisUser.bodyGroupGoals.coreGoal}
            }
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

router.post('/goals', async(req,res) => {
    if(req.session.user){
        const thisUser = await userData.getUserByUsername(req.session.user);
        let updatedCount = 0;
        //Check each input, if it is not passed in then use the old goal value
        if(!xss(req.body.upperGoal)) {req.body.upperGoal = thisUser.bodyGroupGoals.upperGoal;}
        else{
            try{
                req.body.upperGoal = helpers.checkNumber(xss(req.body.upperGoal), 'Upper Body Goal');
                updatedCount++;
            }catch(e){
                res.status(400).render('goals', {
                    title : "Scheduler \• Jimbro",
                    message : `Update aborted: ${e}`,
                    session : req.session.user,
                    goals: {
                        upperGoal: {text: 'Upper Body', goal: thisUser.bodyGroupGoals.upperGoal},
                        lowerGoal: {text: 'Lower Body', goal: thisUser.bodyGroupGoals.lowerGoal},
                        coreGoal: {text: 'Core', goal: thisUser.bodyGroupGoals.coreGoal}
                    }
                });
                return;
            }
        }

        if(!xss(req.body.lowerGoal)) {req.body.lowerGoal = thisUser.bodyGroupGoals.lowerGoal;}
        else{
            try{
                req.body.lowerGoal = helpers.checkNumber(xss(req.body.lowerGoal), 'Lower Body Goal');
                updatedCount++;
            }catch(e){
                res.status(400).render('goals', {
                    title : "Scheduler \• Jimbro",
                    message : `Update aborted: ${e}`,
                    session : req.session.user,
                    goals: {
                        upperGoal: {text: 'Upper Body', goal: thisUser.bodyGroupGoals.upperGoal},
                        lowerGoal: {text: 'Lower Body', goal: thisUser.bodyGroupGoals.lowerGoal},
                        coreGoal: {text: 'Core', goal: thisUser.bodyGroupGoals.coreGoal}
                    }
                });
                return;
            }
        }

        if(!xss(req.body.coreGoal)) {req.body.coreGoal = thisUser.bodyGroupGoals.coreGoal;}
        else{
            try{
                req.body.coreGoal = helpers.checkNumber(xss(req.body.coreGoal), 'Core Goal');
                updatedCount++;
            }catch(e){
                res.status(400).render('goals', {
                    title : "Scheduler \• Jimbro",
                    message : `Update aborted: ${e}`,
                    session : req.session.user,
                    goals: {
                        upperGoal: {text: 'Upper Body', goal: thisUser.bodyGroupGoals.upperGoal},
                        lowerGoal: {text: 'Lower Body', goal: thisUser.bodyGroupGoals.lowerGoal},
                        coreGoal: {text: 'Core', goal: thisUser.bodyGroupGoals.coreGoal}
                    }
                });
                return;
            }
        }
        //Now update the goals
        if(updatedCount === 0){
            res.status(200).render('scheduler', {
                title: 'Scheduler \• Jimbro',
                message: 'Update complete. No new goals were provided.',
                session: req.session.user
            });
            return; 
        } 
        try{
            const userId = thisUser._id;
            await userData.updateGoals(userId, xss(req.body.upperGoal), xss(req.body.lowerGoal), xss(req.body.coreGoal));
            res.status(200).render('scheduler', {
                title: 'Scheduler \• Jimbro',
                message: 'Goals successfully updated!',
                session: req.session.user
            });
        }catch(e){
            res.status(500).render('goals', {
                title : "Scheduler \• Jimbro",
                message : `Update aborted: ${e}`,
                session : req.session.user,
                goals: {
                    upperGoal: {text: 'Upper Body', goal: thisUser.bodyGroupGoals.upperGoal},
                    lowerGoal: {text: 'Lower Body', goal: thisUser.bodyGroupGoals.lowerGoal},
                    coreGoal: {text: 'Core', goal: thisUser.bodyGroupGoals.coreGoal}
                }
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