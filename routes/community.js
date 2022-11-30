const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    res.status(200).render('community', {
        title : "Community \• Jimbro",
        message : "this is the community page"
    });
});

module.exports = router;