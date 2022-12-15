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

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

