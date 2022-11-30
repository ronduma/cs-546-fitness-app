const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    res.status(200).render('home', {
        title : "Home \• Jimbro",
        message : "this is the home page",
        session : req.session.user
    });
});

module.exports = router;