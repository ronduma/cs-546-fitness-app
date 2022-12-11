const express = require('express');
const router = express.Router();
const data = require('../data');
const workouts = data.workouts;
const path = require('path');

router.get('/', async (req, res) => {
    const sampleWorkouts = await workouts.getAllWorkouts();
    res.status(200).render('workouts', {
        title : "Workouts \• Jimbro",
        message : "Welcome to the Workouts Page!",
        session : req.session.user,
        samples : sampleWorkouts
    });
});

module.exports = router;