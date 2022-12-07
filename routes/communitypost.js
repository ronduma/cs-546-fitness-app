const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const helper = require('../helpers');

router.get('/', async (req, res) => {
    res.status(200).render('communitypost', {
        title : "Communitypost \• Jimbro",
        message : "Create Posts",
        session : req.session.user
    });
});

router.post('/', async (req, res) => {
    let postTitle = req.body.postTitleInput;
    let postDetails = req.body.postDetailsInput;
    try{
        postTitle=helper.validatePostTitle(postTitle);
        postDetails=helper.validatePostBody(postDetails);

    }
    catch{
        res.status(400).render('communitypost', { err: true, message: "Create Posts" , login: true,title:"Communitypost \• Jimbro",  session : req.session.user});
    return;
    }
    //After we validate try createPost check if insert is true and redirect to communitypost


});

module.exports = router;