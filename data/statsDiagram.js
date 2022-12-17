const {ObjectId} = require('mongodb');
const mongoCollections = require("../config/mongoCollections");
const helpers = require("../helpers");
const users = mongoCollections.users;
const users_js = require('./users');
// const bcrypt = require('bcryptjs');
// const saltRounds = 10;



// create function that gets input from a scroll wheel
// get weight ratio for each bodyGroup
        // upper, lower, core
// circle graph will show which type of exercise the user does the most
const getAllExcercise = async(userId) =>{
    if(!userId) throw 'Need userId input';
    if(typeof userId !== 'string' ||  userId.trim().length <= 0) throw 'userId needs to be a string';
    if(!ObjectId.isValid(userId)) throw 'invalid object Id';
    let person = await users_js.getUserById(userId);
    let exercise_list = person.workoutRoutine;

    return exercise_list;
    
}

// returns a list of all the upperBody weights
// this will be used to create a line graph that shows the overall progress
const upperData = async(userId) =>{
    // if(!userId) throw 'Need movieId input';
    // if(typeof userId !== 'string' ||  userId.trim().length <= 0) throw 'userId needs to be a string';
    // if(!ObjectId.isValid(userId)) throw 'invalid object Id';
    let workout_lst = await getAllExcercise(userId);
    let weights = [];
    for(let i = 0; i < workout_lst.length; i++){
        if(workout_lst[i].bodyGroup == 'Upper Body'){
            weights.push(workout_lst[i]['weight']);
        }
    }

    return weights;
}

const lowerData = async(userId) => {
    let workout_lst = await getAllExcercise(userId);
    let weights = [];
    for(let i = 0; i < workout_lst.length; i++){
        if(workout_lst[i].bodyGroup === 'Lower Body'){
            weights.push(workout_lst[i]['weight']);
        }
    }

    return weights;
}

const coreData = async(userId) => {
    let workout_lst = await getAllExcercise(userId);
    let weights = [];
    for(let i = 0; i < workout_lst.length; i++){
        if(workout_lst[i].bodyGroup === 'Core'){
            weights.push(workout_lst[i]['weight']);
        }
    }

    return weights;
}

// will show percentage ratio of all the different workouts
const groupRatio = async(userId) =>{
    let upper = await upperData(userId);
    let core = await coreData(userId);
    let lower = await lowerData(userId);

    let result = [upper.length, core.length, lower.length];

    return result;
} 

//gets the overall weights of a specific excercise
const getWeights = async(userId, exercise) => {
    let workout_lst = await getAllExcercise(userId);
    let counter  = 0;
    console.log(exercise);
    console.log(workout_lst);
    for(let i = 0; i < workout_lst.length; i++){
        if(workout_lst[i].name === exercise){
            counter = 1;
        }
    }
    if(counter == 0){
        throw 'Need to have the workout within scheduler.';
    }
    let result = [];
    for(let i = 0; i < workout_lst.length; i++){
        if(workout_lst[i]["name"] === exercise){
            result.push(workout_lst[i]);
        }
    }
    // console.log(result);
    return result;
}


module.exports = {
    getAllExcercise,
    upperData,
    lowerData,
    coreData,
    groupRatio,
    getWeights,
}