const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

// const users = require('./data/users.js');
// const connection = require('./config/mongoConnection');
// const main = async () => {
//     const db = await connection.dbConnection();
//     await db.dropDatabase();
//     user1 = await users.createUser("dtran3@stevens.edu", "dtran", "12345678", "dylan", 20, "5ft 10in", 170, ["Hit a PR for bench", "Do 3x12 with 25's on bicep curl", "Bench 80's"], "PF", "Zyzz");
//     console.log(user1);//2
//     console.log('user1 Dylan has been added!');


//     await connection.closeConnection();
// }

// main();