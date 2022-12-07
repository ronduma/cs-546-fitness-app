const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
users = data.user;
posts = data.post;

router.get('/', async (req, res) => {
    res.status(200).render('communitypost', {
        title : "CommunityPost \• Jimbro",
        message : "this is the communitypost page",
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
        res.status(400).render('pages/communitypost', { err: true, message: "Create Posts" , login: true,title:"Communitypost \• Jimbro",  session : req.session.user});
    return;
    }
    //After we validate try createPost check if insert is true and redirect to communityposts
    try{
        let post= await postData.createPost(req.session.user, postTitle,postDetails);
        console.log(post);
        if ((await post).insertedPost == true){
           res.redirect("community");
           return
        }
    }
    catch{
        res.status(400).render('pages/communitypost', { err: true, message: "Create Posts" , login: true,title:"Communitypost \• Jimbro",  session : req.session.user});

    }

});
module.exports = router;