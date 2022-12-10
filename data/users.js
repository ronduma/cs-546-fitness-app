const {ObjectId} = require('mongodb');
const mongoCollections = require("../config/mongoCollections");
const helpers = require("../helpers");
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const createUser = async (
  username,
  email,
  password,
  firstName=undefined,
  age=undefined,
  height=undefined,
  weight=undefined,
  goals=undefined,
  studio=undefined,
  coach=undefined,
  posts=[],
  workoutRoutine=[]
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
    firstName: firstName,
    age: age,
    height: height,
    weight: weight,
    goals: goals,
    studio: studio,
    coach: coach,
    posts: posts,
    workoutRoutine: workoutRoutine
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

const getUserByUsername = async (userName) => {
  helpers.validateUsername(userName);
  const userCollection = await users();
  const thisUser = await userCollection.findOne({username: userName});
  if(!thisUser) throw 'No user exists with that userName';
  thisUser._id = thisUser._id.toString();
  return thisUser;
}

const addExercise = async (
  userId,
  name,
  weight,
  sets,
  reps, 
  day
) => {
  userId = helpers.checkId(userId, 'userId');
  name = helpers.checkString(name, 'Exercise Name');
  weight = helpers.checkNumber(weight, 'Exercise Weight');
  sets = helpers.checkNumber(sets, 'Number of Sets');
  reps = helpers.checkNumber(reps, 'Number of Reps');
  day = helpers.checkDay(day);
  const thisUser = await getUserById(userId);
  const userName = thisUser.username;
  let newExercise = {
    _id: new ObjectId(),
    user: userName,
    name: name,
    weight: weight,
    sets: sets,
    reps: reps,
    dayPlanned: day
  }
  const exerciseId = newExercise._id.toString();
  thisUser.workoutRoutine.push(newExercise);
  let updatedUser = {
    username: thisUser.username,
    email: thisUser.email,
    password: thisUser.password,
    firstName: thisUser.firstName,
    age: thisUser.age,
    height: thisUser.height,
    weight: thisUser.weight,
    goals: thisUser.goals,
    studio: thisUser.studio,
    coach: thisUser.coach,
    posts: thisUser.posts,
    workoutRoutine: thisUser.workoutRoutine
  }
  const userCollection = await users();
  const updateInfo = await userCollection.updateOne({_id: ObjectId(userId)}, {$set: updatedUser});
  if(!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed'
  return getExercise(exerciseId);
}

const getExercise = async (exerciseId) => {
  exerciseId = helpers.checkId(exerciseId, 'exerciseId');
  const userCollection = await users();
  let exercise = await userCollection.findOne({'workoutRoutine._id': ObjectId(exerciseId)},{projection:{_id: 0, 'workoutRoutine.$':1}});
  if(!exercise) throw 'Error: no exercise found with the given exerciseId'
  let retExer = exercise;
  retExer.workoutRoutine[0]._id = exercise.workoutRoutine[0]._id.toString();
  return retExer.workoutRoutine[0];
}

module.exports = {
  getAllUsers,
  createUser,
  checkUser,
  getUserById,
  getUserByUsername,
  addExercise
};
