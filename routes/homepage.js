const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    res.sendFile(path.resolve('./static/homepage.html'));
});

module.exports = router;