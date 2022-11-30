const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    if(req.session.user){
        return res.status(200).render('profile', {
            title : "Profile \• Jimbro",
            message : "this is the profile page",
            session : req.session.user
        });
      }
      else{
        return res.redirect('/login');
      }
});

module.exports = router;