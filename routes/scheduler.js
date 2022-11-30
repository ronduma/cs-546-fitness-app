const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    res.status(200).render('scheduler', {
        title : "Scheduler \• Jimbro",
        message : "this is the scheduler page",
        session : req.session.user
    });
});

module.exports = router;