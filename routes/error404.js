const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    res.status(200).render('error404', {
        title : "404 Not Found \• Jimbro",
        message : "404 : page not found",
        session : req.session.user
    });
});

module.exports = router;