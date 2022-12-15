const express = require('express');
const router = express.Router();
const helpers = require('../helpers');
const users = require('../data/users');
const path = require('path');

router.get('/', async (req, res) => {
    if(req.session.user){
      let user = await users.getUserByUsername(req.session.user);
      return res.status(200).render('profile', {
          title : "Profile \• Jimbro",
          message : "this is the profile page",
          session : req.session.user,
          username : user.username,
          age : user.age,
          heightFt : user.heightFt,
          heightIn : user.heightIn,
          weight : user.weight,
          studio : user.studio,
          coach : user.coach,
          goals : user.goals
      });
    }
    else{
      return res.redirect('/login');
    }
});

router.get('/edit', async (req, res) => {
  if(req.session.user){
    let user = await users.getUserByUsername(req.session.user);
    return res.status(200).render('edit', {
        title : "Edit Profile \• Jimbro",
        message : "this is the edit profile page",
        session : req.session.user,
        username : user.username
    });
  }
  else{
    return res.redirect('/login');
  }
});

router.post('/edit', async (req, res) => {
  let age = req.body.ageInput;
  let heightFt = req.body.heightFeetInput;
  let heightIn = req.body.heightInchesInput;
  let weight = req.body.weightInput;
  let studio = req.body.studioInput;
  let coach = req.body.coachInput;
  let goals = req.body.goalsInput;
  let user = await users.getUserByUsername(req.session.user);
  try {
    helpers.checkNumber(age, "age");
    helpers.checkNumber(heightFt, "height");
    helpers.checkNumber(heightIn, "height");
    helpers.checkNumber(weight, "weight");
    helpers.checkString(studio, "studio");
    helpers.checkString(coach, "coach");
    helpers.checkString(goals, "goals");
  } catch (e) {
    return res.status(400).render('edit', {
      title : "Edit Profile \• Jimbro",
      message : e,
      session : req.session.user,
      username : user.username
    });
  }
  try {
    let user = await users.updateProfile(req.session.user, age, heightFt, heightIn, weight, studio, coach, goals);
    // console.log(user);
    if ((await user).insertedUser === false){
      return res.status(500).json("Internal Server Error");
    }
    return res.redirect('/profile');
  } catch (e) {
    return res.status(400).render("../views/edit", { error : e });
  }
});

module.exports = router;