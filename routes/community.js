const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const users = data.user;
const postData = data.post;

router.get('/', async (req, res) => {
    let allposts = await postData.getAllPostsNoUser();
    // console.log(allposts);
    console.log(allposts[0].username);
    console.log(allposts[0].postTitle)
    let orderedpost = postData.sortedDesc(allposts);
    console.log(orderedpost);
    res.status(200).render('community', {
        title : "Community \• Jimbro",
        message : "this is the community page",
        session : req.session.user,
        allpost : orderedpost,
    });
    return;
});

// router.post('/', async (req, res) => {
//     res.status(200).render('communitypost', {
//         title : "Communitypost \• Jimbro",
//         message : "this is the community Post page",
//         session : req.session.user
//     });


// });

module.exports = router;