const express = require('express');
const router = express.Router();
const users = require('../data/users');
const path = require('path');

router.get('/', async (req, res) => {
    res.status(200).render('login', {
        title : "Log In \• Jimbro",
        message : "this is the login page",
        session : req.session.user
    });
});

router.post('/', async (req, res) => {
    let username = req.body.usernameInput;
    let password = req.body.passwordInput;
    try {
      await users.checkUser(username, password);
      req.session.user = username;
      return res.redirect('/profile');
    } catch (e) {
      return res.status(400).render("../views/login", { error : e });
    }
});

module.exports = router;