const express = require('express');
const router = express.Router();
const users = require('../data/users');
const path = require('path');

router.get('/', async (req, res) => {
    res.clearCookie('AuthCookie');
    req.session.destroy();
    return res.redirect("/homepage")
});

module.exports = router;