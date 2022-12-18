const express = require("express");
const router = express.Router();
const data = require("../data");
const path = require("path");
const users = data.users;
const postData = data.post;
const commentData = data.comments;
const helpers = require('../helpers');

router.get("/", async (req, res) => {
    if (!req.session.user) {
        res.status(200).render("login", {
            title: "Log In • Jimbro",
            message: "You need to log in to use the Community Page.",
            session: req.session.user,
        });
    } else {
        let allposts = await postData.getAllPostsNoUser();
        let orderedpost = postData.sortedDesc(allposts);
        //console.log(orderedpost);
        // console.log(allposts);
    //console.log(allposts[0]._id);
    // console.log(allposts[0].postTitle)
        res.status(200).render("community", {
            title: "Community • Jimbro",
            message: "this is the community page",
            session: req.session.user,
            allpost: orderedpost,
        });
        return;
    }
});

// router.post('/', async (req, res) => {
//     res.status(200).render('communitypost', {
//         title : "Communitypost \• Jimbro",
//         message : "this is the community Post page",
//         session : req.session.user
//     });

// });

router.route("/:id").get(async (req, res) => {
    //
    if (!req.session.user) {
        res.status(200).render("login", {
            title: "Log In • Jimbro",
            message: "You need to log in to use the Community Page.",
            session: req.session.user,
        });
    } 
    //if not valid postid and logined 
    if (!req.params.id && req.session.user){
        let allposts = await postData.getAllPostsNoUser();
        let orderedpost = postData.sortedDesc(allposts);
        res.status(200).render("community", {
            title: "Community • Jimbro",
            message: "this is the community page",
            session: req.session.user,
            allpost: orderedpost,
        });
        return;
    }
    else {
        try {
            let id = req.params.id;
            // console.log(id);
            const onepost = await postData.getPost(id);
            let idString = id.toString();
            console.log(onepost);
            console.log("WE got the post")
            let author = await users.getUserByUsername(onepost.username);
            const allcomments = await commentData.searchCommentbyPostId(idString);
            console.log(allcomments);
            return res.status(200).render("onepost", {
                onepost: onepost,
                title: "Post • Jimbro",
                message: "this is the one post",
                session: req.session.user,
                onepost: onepost,
                allcomments: allcomments,
                id:id,
                userId : author._id
            });
        } catch (e) {
            let allposts = await postData.getAllPostsNoUser();
            let orderedpost = postData.sortedDesc(allposts);
            res
                .status(404)
                .render("community", {
                    title: "Post • Jimbro",
                    message: "PostID not found",
                    session: req.session.user,
                    onepost: onepost,
                    allpost: orderedpost,
                });
        }
    }
});

router.route("/:id").post(async (req, res) => {
    if (!req.session.user) {
        res.status(200).render("login", {
            title: "Log In • Jimbro",
            message: "You need to log in to use the Community Page.",
            session: req.session.user,
        });
    } 
    let commentDetails = req.body.commentDetailsInput;
    try {
        let id = req.params.id;
            // console.log(id);
        const onepost = await postData.getPost(id);
        //Check the elements for comment
        commentDetails = helpers.validateComment(commentDetails);
        const createdComment = await commentData.createComment(id, req.session.user, commentDetails);
        let idString = id.toString();
        const allcomments = await commentData.searchCommentbyPostId(idString);
        return res.status(200).render("onepost", {
            onepost: onepost,
            title: "Post • Jimbro",
            message: "this is the one post with your newly added comment",
            session: req.session.user,
            onepost: onepost,
            allcomments: allcomments,
            id:id,
            userId : author
        });

    } catch (e) {
        return res.status(404).render("onepost", {
            onepost: onepost,
            title: "Post • Jimbro",
            message: "this is the one post but didnt add newly added comment",
            session: req.session.user,
            onepost: onepost,
            allcomments: allcomments,
            id:id,
        });
    }

});

router.route("/:id").delete(async (req, res) => {
    if (!req.session.user) {
        res.status(200).render("login", {
            title: "Log In • Jimbro",
            message: "You need to log in to use the Community Page.",
            session: req.session.user,
        });
    }
    try{
        let id = req.params.id;
        id = helpers.checkId(id, "postId");
        let post = await postData.deletePost(id, req.session.user);
        let allposts = await postData.getAllPostsNoUser();
        let orderedpost = postData.sortedDesc(allposts);
        // console.log(orderedpost);
        // owner = true
        res.render("community", {
            title: "Post • Jimbro",
            message: "Post Deleted",
            session: req.session.user,
            allpost: orderedpost,
        });
    }catch(e){
        console.log(e);
        let allposts = await postData.getAllPostsNoUser();
        let orderedpost = postData.sortedDesc(allposts);

        res.render("community", {
            title: "Post • Jimbro",
            message: "Post Not Deleted",
            session: req.session.user,
            allpost: orderedpost,
        });

        // next();
    }
});

router.get('/profile/:id', async (req, res) => {
    if(req.session.user){
      let user = await users.getUserById(req.params.id);
      return res.status(200).render('communityProfile', {
          title : user.username.concat("'s Profile \• Jimbro"),
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

module.exports = router;
