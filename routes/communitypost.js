const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const users = data.user;
const postData = data.post;
const helper = require('../helpers');

router.get('', async (req, res) => {
    if (!req.session.user){
        return res.render('login', {
            title : "Log In \• Jimbro",
        message : "this is the login page"});
    }
    else{
    return res.status(200).render('communitypost', {
        title : "CommunityPost \• Jimbro",
        message : "this is the communitypost page",
        session : req.session.user
    });
}
});

router.post('/', async (req, res) => {
    //console.log(req.body.postTitleInput);
    //console.log(req.body.postDetailsInput);

    let postTitle = req.body.postTitleInput;
    let postDetails = req.body.postDetailsInput;
    try{

        postTitle=helper.validatePostTitle(postTitle);
        postDetails=helper.validatePostBody(postDetails);
    }
    catch (e){
        res.render('communitypost', { err: true, error: e, message: "Create Posts" , login: true,title:"Communitypost \• Jimbro",  session : req.session.user});
    return;
    }
    //After we validate try createPost check if insert is true and redirect to communityposts
    //console.log("try create post")
    try{
        console.log("Trying to create post")
        let post= await postData.createPost(req.session.user, postTitle, postDetails);
        console.log(post);
        if ((await post).insertedPost == true){
            let allpost = await postData.getAllPostsNoUser();
           // console.log(allpost);
        //    res.status(200).render('community'), {
        //     title : "Community \• Jimbro",
        //     message : "this is the community page",
        //     session : req.session.user,
        //     allpost : allpost
        //    };
        res.redirect('community')
           return;
        }
    }
    catch(e){
        res.render('communitypost', { err: true, error: e, message: "Create Posts" , login: true,title:"Communitypost \• Jimbro",  session : req.session.user});

    }

});

module.exports = router;