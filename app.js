

const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const static = express.static(__dirname + '/public');
app.use('/public', static);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use(rewriteUnsupportedBrowserMethods);

app.use(
  session({
    name: 'AuthCookie',
    secret: "some secret string!",
    saveUninitialized: true,
    resave: false
  })
);
  
app.use('/profile', (req, res, next) => {
  if (!req.session.user) {
    return res.render('../views/login');
  } else {
    next();
  }
});

app.use('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/profile');
  } else {
    next();
  }
});

app.use(async (req, res, next) => {
  let timestamp = new Date().toUTCString();
  if (req.session.user){
    console.log("[" + timestamp + "]" + ": " + req.method + " " + req.originalUrl + (" Authenticated User"))
  }
  else{
    console.log("[" + timestamp + "]" + ": " + req.method + " " + req.originalUrl + (" Non-Authenticated User"))
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});


// const users = require('./data/users');
// const posts = require('./data/posts');
// const comments = require('./data/comments')
// const connection = require('./config/mongoConnection');
// const main = async () => {
//     const db = await connection.dbConnection();

// //     post2= await posts.createPost("testuser", "test user post", "An nonempty post");
// //     console.log(post2);//2

// // /Get all post of user2 which has no posts []
// //     getAllpost= await posts.getAllPosts("6386e40aad58eff67e5563a2");
// //     console.log(getAllpost);//2

// //     post= await posts.createPost("testuser", "test user post222", "An nonempty post");
// //     console.log(post);//2

// //     getAllpost = await posts.getAllPostsNoUser();
// //     console.log(getAllpost);

// //     desc = posts.sortedDesc(getAllpost);
// //     console.log(desc);

// //     getpost= await posts.getPost('6392b11a9d1bcf3c4b28c59f');
// //     console.log(getpost);
// //     getComments = await posts.getComments('6392b11a9d1bcf3c4b28c59f');
// //     console.log(getComments);
// //     createdComment = await posts.createComment('testuser','639bc26e99f4a15566e44a70', 'comment','1st comment on DDD');
// //     console.log(createdComment);
// //     getComments = await posts.getComments('6392b11a9d1bcf3c4b28c59f');
// //     console.log(getComments);
    // Likes = await posts.getLikes('639a8bfb1a9390835e2f9b74');
    // console.log(Likes);
    // addlike = await posts.addLike('dylantran', 'testuser','639a8bfb1a9390835e2f9b74');
    // console.log(addlike);
    // newLikes = await posts.getLikes('639a8bfb1a9390835e2f9b74');
    // console.log(newLikes);
    // addlike = await posts.addLike('trang', 'testuser','639a8bfb1a9390835e2f9b74');
    // console.log(addlike);

    
// //     createdcomment = await comments.createComment('639bc26e99f4a15566e44a70', 'comment','2nd comment on DDD');
// //     console.log(createdcomment);
//     // searchedcomment = await comments.searchCommentbyID('639c144710a21b5b1fa57c98');
//     // console.log(searchedcomment);
//     // commentlistofpost = await comments.searchCommentbyPostId('639bc26e99f4a15566e44a70');
//     // console.log(commentlistofpost);

    
//     await connection.closeConnection();
// }

// main();

// const users = require('./data/users');
// const posts = require('./data/posts');
// const comments = require('./data/comments')
// const connection = require('./config/mongoConnection');
// const main = async () => {
//     const db = await connection.dbConnection();

// // //     post2= await posts.createPost("testuser", "test user post", "An nonempty post");
// // //     console.log(post2);//2

// // // /Get all post of user2 which has no posts []
// // //     getAllpost= await posts.getAllPosts("6386e40aad58eff67e5563a2");
// // //     console.log(getAllpost);//2

// // //     post= await posts.createPost("testuser", "test user post222", "An nonempty post");
// // //     console.log(post);//2

// // //     getAllpost = await posts.getAllPostsNoUser();
// // //     console.log(getAllpost);

// // //     desc = posts.sortedDesc(getAllpost);
// // //     console.log(desc);

// // //     getpost= await posts.getPost('6392b11a9d1bcf3c4b28c59f');
// // //     console.log(getpost);
// // //     getComments = await posts.getComments('6392b11a9d1bcf3c4b28c59f');
// // //     console.log(getComments);
// // //     createdComment = await posts.createComment('testuser','639bc26e99f4a15566e44a70', 'comment','1st comment on DDD');
// // //     console.log(createdComment);
// // //     getComments = await posts.getComments('6392b11a9d1bcf3c4b28c59f');
// // //     console.log(getComments);
//     // Likes = await posts.getLikes('639a8bfb1a9390835e2f9b74');
//     // console.log(Likes);
//     // addlike = await posts.addLike('dylantran', 'testuser','639a8bfb1a9390835e2f9b74');
//     // console.log(addlike);
//     // newLikes = await posts.getLikes('639a8bfb1a9390835e2f9b74');
//     // console.log(newLikes);
//     // addlike = await posts.addLike('trang', 'testuser','639a8bfb1a9390835e2f9b74');
//     // console.log(addlike);

    
// // //     createdcomment = await comments.createComment('639bc26e99f4a15566e44a70', 'comment','2nd comment on DDD');
// // //     console.log(createdcomment);
// //     // searchedcomment = await comments.searchCommentbyID('639c144710a21b5b1fa57c98');
// //     // console.log(searchedcomment);
// //     // commentlistofpost = await comments.searchCommentbyPostId('639bc26e99f4a15566e44a70');
// //     // console.log(commentlistofpost);
//     // commentlistofpost = await posts.getLikesfromUsername('jordanwang');
//     // console.log(commentlistofpost);
//     createdcomment = await comments.createComment('639ec84ae9cc64f6a08e3038', 'wwwww','2nd comment on DDD');
//     console.log(createdcomment);
//     // commentCount = await comments.getAllCommentsCountByUser('www');
//     // console.log(commentCount);
//     //     createdcomment = await comments.createComment('639bc26e99f4a15566e44a70', 'comment','2nd comment on DDD');
//     // console.log(createdcomment);

    
//     await connection.closeConnection();
// }

// main();
