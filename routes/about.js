const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    res.status(200).render('about', {
        title : "About Us \• Jimbro",
        message : "this is the about page",
        session : req.session.user
    });
});

module.exports = router;