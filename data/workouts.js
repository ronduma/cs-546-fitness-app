const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const { workouts } = require('../config/mongoCollections');
const helpers = require('../helpers');

const addWorkout = async (name, workout, dayPlanned, bodyGroup) => {
    const workoutCollection = await workouts();
    const newWorkout = {
        name: name,
        workout: workout,
        dayPlanned: dayPlanned,
        bodyGroup: bodyGroup
    };
    const insertedInfo = await workoutCollection.insertOne(newWorkout);
    if(!insertedInfo.acknowledged || !insertedInfo.insertedId) throw 'Could not add workout'
    const newId = insertedInfo.insertedId.toString();
    const postedWorkout = await getWorkoutById(newId);
    return postedWorkout;
}

const getAllWorkouts = async() => {
    const workoutCollection = await workouts();
    let retVal = await workoutCollection.find({}).toArray();
    if(!retVal) return [];
    retVal.forEach(elem => elem._id = elem._id.toString());
    return retVal;
}

const getWorkoutById = async (workoutId) => {
    workoutId = helpers.checkId(workoutId);
    const workoutCollection = await workouts();
    const thisWorkout = await workoutCollection.findOne({_id: ObjectId(workoutId)});
    if(thisWorkout === null) throw 'No workout exists with the given workoutId';
    thisWorkout._id = thisWorkout._id.toString();
    return thisWorkout;
}

const getWorkoutByName = async (workoutName) => {
    workoutName = helpers.checkString(workoutName, 'Workout Name');
    const workoutCollection = await workouts();
    const thisWorkout = await workoutCollection.findOne({name: workoutName});
    if(thisWorkout === null) throw 'No workout exists with the given workoutName';
    thisWorkout._id = thisWorkout._id.toString();
    return thisWorkout;
}

const removeWorkout = async (workoutId) => {
    workoutId = helpers.checkId(workoutId);
    const workoutCollection = await workouts();
    const workoutInfo = await getWorkoutById(workoutId);
    const deleteInfo = await workoutCollection.deleteOne({_id: ObjectId(workoutId)});
    if(deleteInfo.deletedCount === 0) throw `Could not delete workout with id ${workoutId}`
    return `${workoutInfo.name} has been successfully deleted!`
};

module.exports = {
    addWorkout,
    getAllWorkouts,
    getWorkoutById,
    getWorkoutByName,
    removeWorkout
};