const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    res.status(200).render('login', {
        title : "Log In \• Jimbro",
        message : "this is the login page"
    });
});

module.exports = router;