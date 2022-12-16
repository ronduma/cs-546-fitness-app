const express = require("express");
const router = express.Router();
const data = require("../data");
const path = require("path");
const users = data.user;
const postData = data.post;

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
    //if not valid id and logined 
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
            console.log(id);
            const onepost = await postData.getPost(id);
            console.log(onepost);
            return res.status(200).render("onepost", {
                onepost: onepost,
                title: "Post • Jimbro",
                message: "this is the one post",
                session: req.session.user,
                onepost: onepost,
            });
        } catch (e) {
            let id = req.params.id;
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

module.exports = router;
