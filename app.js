const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

const static = express.static(__dirname + '/public');
app.use('/public', static);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// TODO: copy paste from lab 10 to figure out signup/login
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
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    // console.log("2")
    // req.method = 'GET';
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

// app.listen(3000, () => {
//   console.log("We've now got a server!");
//   console.log('Your routes will be running on http://localhost:3000');
// });

//TEST POSTS AND USER ADD
// const users = require('./data/users');
// const posts = require('./data/posts');
// const connection = require('./config/mongoConnection');
// const main = async () => {
//     const db = await connection.dbConnection();

//     await db.dropDatabase();
//     user1 = await users.createUser("dtran", "Password123!", "dtran3@stevens.edu");
//     console.log(user1);//2
//     console.log('user1 Dylan has been added!');


    // user1 = await users.createUser("dtran31@stevens.edu", "dtran", "12345678", "dylan", 20, "5ft 10in", 170, ["Hit a PR for bench", "Do 3x12 with 25's on bicep curl", "Bench 80's"], "PF", "Zyzz");
    // console.log(user1);//2
    // console.log('user1 Dylan has been added!');
    // user2 = await users.createUser("DDDDD@stevens.edu", "dtran", "12345678", "dylan", 20, "5ft 10in", 170, ["Hit a PR for bench", "Do 3x12 with 25's on bicep curl", "Bench 80's"], "PF", "Zyzz");
    // console.log(user2);//2

    //Creaste POSTS
    // post1= await posts.createPost("6386e01babaf0b74a877b322", "Fake postTitle", "An nonempty post");
    // console.log(post1);//2

    // post2= await posts.createPost("6386e01babaf0b74a877b322", "Fake postTitle2", "2 An nonempty post");
    // console.log(post2);//2

//Get all post of user2 which has no posts []
    // getAllpost= await posts.getAllPosts("6386e40aad58eff67e5563a2");
    // console.log(getAllpost);//2

//     await connection.closeConnection();
// }

// main();