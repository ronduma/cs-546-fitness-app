const {ObjectId} = require('mongodb');
const mongoCollections = require("../config/mongoCollections");
const helpers = require("../helpers");
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 16;

const createUser = async (
  username,
  email,
  password
) => {
  helpers.validateUsername(username);
  helpers.validatePassword(password);
  //create user
  const userCollection = await users();
  const userExists = await userCollection.findOne({username: username});
  if (userExists){throw 'Error: A user with that username already exists.'}
  password = await bcrypt.hash(password, saltRounds);
  let newUser = {
    username: username,
    email: email,
    password: password,
    firstName: undefined,
    age: undefined,
    height: undefined,
    weight: undefined,
    goals: undefined,
    studio: undefined,
    coach: undefined,
    posts: [],
    workoutRoutine: []
  };
  const insertInfo = await userCollection.insertOne(newUser);
  console.log(insertInfo)
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add user";
  }
  return {insertedUser : true} 
};

const checkUser = async (
  username,
  password
) => {
  username = username.toLowerCase();
  const userCollection = await users();
  const userExists = await userCollection.findOne({username: username});
  if (!userExists){throw 'Error: The given username and/or password does not match our records. Please try again.'}
  let compare = await bcrypt.compare(password, userExists.password);
  if (compare){return {authenticatedUser : true}}
  else throw 'Error: Invalid password. Please try again.'
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
  checkUser,
  getUserById,
};
