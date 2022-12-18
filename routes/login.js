const express = require('express');
const router = express.Router();
const users = require('../data/users');
const path = require('path');
const xss = require('xss');

router.get('/', async (req, res) => {
    return res.status(200).render('login', {
        title : "Log In \• Jimbro",
        message : "this is the login page",
        session : req.session.user
    });
});

router.post('/', async (req, res) => {
    let username = xss(req.body.usernameInput);
    let password = xss(req.body.passwordInput);
    try {
      await users.checkUser(username, password);
      req.session.user = username.toLowerCase();
      console.log(req.session.user);
      console.log(password);
      return res.redirect('/profile');
    } catch (e) {
      return res.status(400).render("../views/login", { error : e });
    }
});

module.exports = router;