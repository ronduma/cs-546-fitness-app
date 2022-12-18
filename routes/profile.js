const express = require('express');
const router = express.Router();
const helpers = require('../helpers');
const users = require('../data/users');
const path = require('path');
const xss = require('xss');
const posts = require('../data/posts');
const comments = require('../data/comments');

router.get('/', async (req, res) => {
    if(req.session.user){
      let user = await users.getUserByUsername(req.session.user);
      let totalLikes = await posts.getLikesfromUsername(req.session.user);
      // console.log(totalLikes);
      let commentcount = await comments.getAllCommentsCountByUser(req.session.user);
      // console.log(commentcount);
      let commentL =0;
      let level = 0;
      if (totalLikes == 0) {
        level=0;
      }
      if (totalLikes > 0) {
        level=1;
      }
      if (totalLikes > 5) {
        level=2;
      }
      if (commentcount >5){
        commentL=1;
      }
      if (commentcount >10){
        commentL=2;
      }
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
          goals : user.goals,
          level: level,
          commentkarma: commentL
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

router.post('/edit', async (req, res) => {
  let age = xss(req.body.ageInput);
  let heightFt = xss(req.body.heightFeetInput);
  let heightIn = xss(req.body.heightInchesInput);
  let weight = xss(req.body.weightInput);
  let studio = xss(req.body.studioInput);
  let coach = xss(req.body.coachInput);
  let goals = xss(req.body.goalsInput);
  let user = await users.getUserByUsername(req.session.user);
  try {
    helpers.checkNumber(age, "age");
    helpers.checkNumber(heightFt, "heightFt");
    helpers.checkNumber(heightIn, "heightIn");
    helpers.checkNumber(weight, "weight");
    helpers.checkString(studio, "studio");
    helpers.checkString(coach, "coach");
    helpers.checkString(goals, "goals");
  } catch (e) {
    console.log("yo")
    return res.status(400).render('edit', {
      title : "Edit Profile \• Jimbro",
      error : e,
      session : req.session.user,
      username : user.username,
      age : age,
      heightFt : heightFt,
      heightIn : heightIn,
      weight : weight,
      studio : studio,
      coach : coach,
      goals : goals
    });
  }
  try {
    let user = await users.updateProfile(req.session.user, age, heightFt, heightIn, weight, studio, coach, goals);
    if ((await user).insertedUser === false){
      return res.status(500).json("Internal Server Error");
    }
    return res.redirect('/profile');
  } catch (e) {
    return res.status(400).render("../views/edit", { error : e });
  }
});

module.exports = router;