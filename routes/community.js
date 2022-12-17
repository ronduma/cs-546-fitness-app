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

// router.post('/', async (req, res) => {
//     if (!req.session.user) {
//         res.status(200).render("login", {
//             title: "Log In • Jimbro",
//             message: "You need to log in to use the Community Page.",
//             session: req.session.user,
//         });
//     } else {
//         let allposts = await postData.getAllPostsNoUser();
//         let orderedpost = await postData.sortedDesc(allposts);
//         console.log(orderedpost);
//         // console.log(allposts);
//     //console.log(allposts[0]._id);
//     // console.log(allposts[0].postTitle)
//         res.status(200).render("community", {
//             title: "Community • Jimbro",
//             message: "this is the community page!",
//             session: req.session.user,
//             allpost: orderedpost,
//         });
//         //add like
//     }
    

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
         id = helpers.checkId(id);
        }
        catch(e){
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
            console.log(onepost);
            console.log("WE got the post")
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

module.exports = router;
