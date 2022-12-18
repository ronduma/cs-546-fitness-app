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
        let orderedpost = await postData.sortedDesc(allposts);
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

router.post('/', async (req, res) => {
    //if not loggined in go login
    if (!req.session.user) {
        res.status(200).render("login", {
            title: "Log In • Jimbro",
            message: "You need to log in to use the Community Page.",
            session: req.session.user,
        });
    }
    let likeInputID = req.body.LikeInputID;
    let likeInputName = req.body.LikeInputname;
    console.log(likeInputID);
    console.log(likeInputName);
    //check inputs
    try {
        helpers.checkId(likeInputID, likeInputID);
        let username=await users.getUserByUsername(likeInputName);
        //Check likeinputName
    } catch (e) {
        res.redirect('/community');
    }
    try {
        let likeadd = await postData.addLike(req.session.user, likeInputName, likeInputID);
        if (likeadd.addedLike == true){
            let allposts = await postData.getAllPostsNoUser();
            let orderedpost = await postData.sortedDesc(allposts);

            res.status(200).render("community", {
                title: "Community • Jimbro",
                message: "this is the community page!",
                session: req.session.user,
                allpost: orderedpost,
            });
        }
    } catch (e) {
        let allposts = await postData.getAllPostsNoUser();
        let orderedpost = await postData.sortedDesc(allposts);
        // res.status(400).json({error: `${e}`});
        res.status(400).render("community", {
            title: "Community • Jimbro",
            message: e,
            session: req.session.user,
            allpost: orderedpost,
        });
    }

});
//CHECK THE ERROR CHECKING IN ROUTIES
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
    if (!req.params.id && req.session.user) {
        let allposts = await postData.getAllPostsNoUser();
        let orderedpost = await postData.sortedDesc(allposts);
        res.status(200).render("community", {
            title: "Community • Jimbro",
            message: "this is the community page",
            session: req.session.user,
            allpost: orderedpost,
        });
        return;
    }
    else {
        let id = req.params.id;
        try {
            //postid =id
            id = helpers.checkId(id);
        }
        catch (e) {
            let allposts = await postData.getAllPostsNoUser();
            let orderedpost = await postData.sortedDesc(allposts);
            res.status(400).render("community", {
                title: "Community • Jimbro",
                message: "this is the community page and postId not found",
                session: req.session.user,
                allpost: orderedpost,
            });
            return;

        }
        try {
            // console.log(id);
            let id = req.params.id;
            const onepost = await postData.getPost(id.trim());
            let idString = id.toString();
            const allcomments = await commentData.searchCommentbyPostId(idString);
            const user =await users.getUserByUsername(onepost.username)
            let userId =user._id;
            console.log(userId);
            console.log(onepost);
            return res.status(200).render("onepost", {
                onepost: onepost,
                title: "Post • Jimbro",
                message: "this is the one post",
                session: req.session.user,
                allcomments: allcomments,
                id: id,
                userId: userId,
            });
        } catch (e) {
            let allposts = await postData.getAllPostsNoUser();
            let orderedpost = await postData.sortedDesc(allposts);
            res
                .status(404)
                .render("community", {
                    title: "Post • Jimbro",
                    message: "PostID not found",
                    session: req.session.user,
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
        helpers.checkId(id, id);
        const onepost = await postData.getPost(id);
    } catch (e) {
        let allposts = await postData.getAllPostsNoUser();
            let orderedpost = await postData.sortedDesc(allposts);
            res
                .status(404)
                .render("community", {
                    title: "Post • Jimbro",
                    message: e,
                    session: req.session.user,
                    allpost: orderedpost,
                });
        }
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
            id: id,
        });

    } catch (e) {
        //ONEPOST NOT DEFINED
        let id = req.params.id;
        let allposts = await postData.getAllPostsNoUser();
        const onepost = await postData.getPost(id);
        let orderedpost = await postData.sortedDesc(allposts);
        let idString = id.toString();
        const allcomments = await commentData.searchCommentbyPostId(idString);
        return res.status(404).render("onepost", {
            onepost: onepost,
            title: "Post • Jimbro",
            message: e,
            session: req.session.user,
            onepost: onepost,
            allcomments: allcomments,
            id: id,
        });
    }

});

router.get('/profile/:id', async (req, res) => {
    if(req.session.user){
        console.log(req.params.id);
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
