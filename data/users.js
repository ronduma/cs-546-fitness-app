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
  heightFt=undefined,
  heightIn=undefined,
  weight=undefined,
  goals=undefined,
  studio=undefined,
  coach=undefined,
  posts=[],
  workoutRoutine=[],
  bodyGroupGoals = {
    upperGoal: 0,
    lowerGoal: 0,
    coreGoal: 0
  }
) => {
  helpers.validateUsername(username);
  helpers.validatePassword(password);
  //create user
  const userCollection = await users();
  const userExists = await userCollection.findOne({username: username});
  if (userExists){throw 'Error: A user with that username already exists.'}
  const emailExists = await userCollection.findOne({email: email});
  if (emailExists){throw 'Error: A user with that email already exists.'}
  password = await bcrypt.hash(password, saltRounds);
  let newUser = {
    username: username,
    email: email,
    password: password,
    firstName: firstName,
    age: age,
    heightFt: heightFt,
    heightIn: heightIn,
    weight: weight,
    goals: goals,
    studio: studio,
    coach: coach,
    posts: posts,
    workoutRoutine: workoutRoutine,
    bodyGroupGoals: bodyGroupGoals
  };
  const insertInfo = await userCollection.insertOne(newUser);
  console.log(insertInfo)
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw "Could not add user";
  }
  // let userId = newUser["_id"].toString();

  // newUser["_id"] = userId;
  // return newUser;
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

const getUserByUsername = async (username) => {
  username = username.toLowerCase();
  const userCollection = await users();
  const user = await userCollection.findOne({username: username});
  if (!user){throw 'Error: The given username does not match our records. Please try again.'}
  user._id = user._id.toString();
  return user
}


const updateProfile = async (
  username,
  age,
  heightFt,
  heightIn,
  weight,
  studio,
  coach,
  goals
) => {
  getUserByUsername(username);
  helpers.checkNumber(age, "age");
  helpers.checkNumber(heightFt, "height");
  helpers.checkNumber(heightIn, "height");
  helpers.checkNumber(weight, "weight");
  studio = helpers.checkString(studio, "studio")
  coach = helpers.checkString(coach, "weight");
  goals = helpers.checkString(goals, "goals");
  const updatedValues = {
    age : age,
    heightFt : heightFt,
    heightIn : heightIn,
    weight : weight,
    studio : studio,
    coach : coach,
    goals : goals
  }
  console.log(updatedValues)
  const userCollection = await users();
  let user = await getUserByUsername(username);
  console.log(typeof user._id)
  const update = await userCollection.updateOne(
    {_id: ObjectId(user._id)},
    {$set: updatedValues}
  );
  console.log(update)
  user = await getUserByUsername(username);
  // console.log(user)
  return user
}

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


const addExercise = async (
  userId,
  name,
  weight,
  sets,
  reps, 
  day,
  bodyGroup
) => {
  userId = helpers.checkId(userId, 'userId');
  name = helpers.checkString(name, 'Exercise Name');
  weight = helpers.checkNumber(weight, 'Exercise Weight');
  sets = helpers.checkNumber(sets, 'Number of Sets');
  reps = helpers.checkNumber(reps, 'Number of Reps');
  day = helpers.checkDay(day);
  bodyGroup = helpers.checkBodyGroup(bodyGroup);
  const thisUser = await getUserById(userId);
  thisUser.workoutRoutine.forEach(elem => {if(elem.name.toLowerCase() === name.toLowerCase() && elem.dayPlanned === day) throw `Error: ${name} already exists on ${day}`})
  const userName = thisUser.username;
  let newExercise = {
    _id: new ObjectId(),
    user: userName,
    name: name,
    weight: weight,
    sets: sets,
    reps: reps,
    dayPlanned: day,
    bodyGroup: bodyGroup
  }
  const exerciseId = newExercise._id.toString();
  thisUser.workoutRoutine.push(newExercise);
  let updatedUser = {
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

const removeExercise = async(exerciseName, dayOfWeek, userId) => {
  exerciseName = helpers.checkString(exerciseName, 'Exercise Name');
  dayOfWeek = helpers.checkDay(dayOfWeek);
  userId = helpers.checkId(userId, 'User Id');
  const thisUser = await getUserById(userId);
  const userCollection = await users();
  const deleteInfo = await userCollection.updateOne(
    {'workoutRoutine.name': exerciseName, 'workoutRoutine.dayPlanned': dayOfWeek}, 
    {$pull: {'workoutRoutine': {name: exerciseName, dayPlanned: dayOfWeek}}});
  if(deleteInfo.matchedCount === 0) throw `Error: There is no exercise ${exerciseName} on ${dayOfWeek}`;
  if(deleteInfo.modifiedCount === 0) throw `Error: unable to remove the exercise ${exerciseName} on ${dayOfWeek}`;
  return true;
}

const updateGoals = async (userId, upperGoal, lowerGoal, coreGoal) => {
  userId = helpers.checkId(userId, 'userId');
  upperGoal= helpers.checkNumGoal(upperGoal, 'upperGoal');
  lowerGoal = helpers.checkNumGoal(lowerGoal, 'lowerGoal');
  coreGoal = helpers.checkNumGoal(coreGoal, 'coreGoal');
  const thisUser = await getUserById(userId);
  const newGoals = {
    upperGoal: upperGoal,
    lowerGoal: lowerGoal,
    coreGoal: coreGoal
  };
  const updatedUser = {
    bodyGroupGoals: newGoals
  };
  const userCollection = await users();
  const updateInfo = await userCollection.updateOne({_id: ObjectId(userId)}, {$set: updatedUser});
  if(!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed'
  return getUserById(userId);
}

module.exports = {
  getAllUsers,
  createUser,
  checkUser,
  getUserById,
  getUserByUsername,
  addExercise,
  getExercise,
  removeExercise,
  updateGoals,
  updateProfile,
};
