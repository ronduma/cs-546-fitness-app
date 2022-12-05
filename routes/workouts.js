const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

const sampleWorkouts = [
{
    name: 'Upper Body',
    workout: [
        {
            exercise: 'Shoulder Press',
            weight: 20,
            sets: 3,
            reps: 15
        },
        {
            exercise: 'Bicep Curls',
            weight: 15,
            sets: 5,
            reps: 20
        },
        {
            exercise: 'Lateral Pulldown',
            weight: 50,
            sets: 3,
            reps: 12
        },
        {
            exercise: 'Seated Row',
            weight: 60,
            sets: 4,
            reps: 15
        },
        {
            exercise: 'Lateral Raises',
            weight: 10,
            sets: 4,
            reps: 20
        }
    ],
    day: 'Monday'
},
{
    name: 'Lower Body',
    workout: [
        {
            exercise: 'Leg Press',
            weight: 200,
            sets: 4,
            reps: 12
        },
        {
            exercise: 'Squats',
            weight: 150,
            sets: 3,
            reps: 10
        },
        {
            exercise: 'Calf Raises',
            weight: 20,
            sets: 4,
            reps: 20
        },
        {
            exercise: 'Hamstring Curls',
            weight: 50,
            sets: 4,
            reps: 12
        },
        {
            exercise: 'Quad Extensions',
            weight: 60,
            sets: 4,
            reps: 12
        }
    ],
    day: 'Wednesday'
}]

router.get('/', async (req, res) => {
    res.status(200).render('workouts', {
        title : "Workouts \• Jimbro",
        message : "this is the workouts page",
        session : req.session.user,
        samples : sampleWorkouts
    });
});

module.exports = router;