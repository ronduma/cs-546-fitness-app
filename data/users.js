const {ObjectId} = require('mongodb');
const mongoCollections = require("../config/mongoCollections");
const helpers = require("../helpers");
const users = mongoCollections.users;

const createUser = async (
  email,
  username,
  password,
  firstName,
  age,
  height,
  weight,
  goals,
  studio,
  coach
) => {
  if (!email || email == undefined) {
    throw "You must provide a email for movie";
  }
  if (typeof email != "string") {
    throw "You must provide a string for email";
  }
  if (email.trim().length == 0) {
    throw "Empty String or just just spaces";
  }
  if (helpers.checkStringHasAtPeriod == false){
    throw 'Need to be valid email';

  }
  helpers.validatePassword(password);
  helpers.checkString(firstName);
  helpers.checkNumber(age);
  helpers.checkHeight(height)
  helpers.checkNumber(weight);
  helpers.checkGoals(goals);
  helpers.checkString(studio);
  helpers.checkString(coach);
  //create user
  const userCollection = await users();
  let newUser = {
    email: email,
    username: username,
    password: password,
    firstName: firstName,
    age: age,
    height: height,
    weight: weight,
    goals: goals,
    studio: studio,
    coach: coach,
    posts: [],
    workoutRoutine: [],
  };
  const insertInfo = await userCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add user";
  }

  const newId = insertInfo.insertedId.toString();

  const movie = await getUserById(newId);
  movie._id = movie._id.toString();
  return movie;
};

const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (!userList) throw "Could not get all users";
  // console.log(movieList);
  for (let i = 0; i < userList.length; i++) {
    userList[i]._id = userList[i]._id.toString();
  }
  return userList;
};

const getUserById = async (userId) => {
    if (!userId) throw 'You must provide an id to search for';
      if (typeof userId !== 'string') throw 'Id must be a string';
      if (userId.trim().length === 0)
        throw 'Id cannot be an empty string or just spaces';
        userId = userId.trim();
      if (!ObjectId.isValid(userId)) throw 'invalid object ID';
      const userCollection = await users();
      const usero = await userCollection.findOne({_id: ObjectId(userId)});
      if (usero === null) throw 'No user with that id';
      usero._id = usero._id.toString();
  
      return usero;
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
};
