const { ServerSession } = require('mongodb');
const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const users = data.users;
const workout = data.workouts;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    
    // Generate sample workouts
    await workout.addWorkout(
        'Upper Body',
        [{
            exercise: 'Shoulder Press',
            weight: 20,
            sets: 3,
            reps: 15
        },
        {
            exercise: 'Bicep Curls',
            weight: 15,
            sets: 5,
            reps: 20
        },
        {
            exercise: 'Lateral Pulldown',
            weight: 50,
            sets: 3,
            reps: 12
        },
        {
            exercise: 'Seated Row',
            weight: 60,
            sets: 4,
            reps: 15
        },
        {
            exercise: 'Lateral Raises',
            weight: 10,
            sets: 4,
            reps: 20
        }],
        'Monday',
        'Upper Body'
    );
    await workout.addWorkout(
        'Shoulders and Triceps',
        [{
            exercise: 'Shoulder Press',
            weight: 25,
            sets: 5,
            reps: 15
        },
        {
            exercise: 'Lateral Raises',
            weight: 10,
            sets: 5,
            reps: 20
        },
        {
            exercise: 'Front Raises',
            weight: 10, 
            sets: 5,
            reps: 20
        },
        {
            exercise: 'Upright Row',
            weight: 30,
            sets: 4,
            reps: 10
        },
        {
            exercise: 'Close Grip Bench Press',
            weight: 45,
            sets: 4,
            reps: 12
        },
        {
            exercise: 'Rear Delt',
            weight: 50,
            sets: 4,
            reps: 15
        },
        {
            exercise: 'Tricep Pushdown',
            weight: 40,
            sets: 4,
            reps: 15
        }],
        'Tuesday',
        'Upper Body'
    );   
    await workout.addWorkout(
        'Legs',
        [{
            exercise: 'Leg Press',
            weight: 200,
            sets: 4,
            reps: 12
        },
        {
            exercise: 'Squats',
            weight: 150,
            sets: 3,
            reps: 10
        },
        {
            exercise: 'Calf Raises',
            weight: 20,
            sets: 4,
            reps: 20
        },
        {
            exercise: 'Hamstring Curls',
            weight: 50,
            sets: 4,
            reps: 12
        },
        {
            exercise: 'Quad Extensions',
            weight: 60,
            sets: 4,
            reps: 12
        }],
        'Wednesday',
        'Lower Body'
    ); 
    await workout.addWorkout(
        'Back and Biceps',
        [{
            exercise: 'Bicep Curls',
            weight: 20,
            sets: 5,
            reps: 15
        },
        {
            exercise: 'Seated Row',
            weight: 75,
            sets: 5,
            reps: 20
        },
        {
            exercise: 'Dumbell Row',
            weight: 20,
            sets: 5,
            reps: 15
        },
        {
            exercise: 'Lateral Pulldown',
            weight: 60,
            sets: 4,
            reps: 12
        },
        {
            exercise: 'Cable Curls',
            weight: 20,
            sets: 4,
            reps: 12
        }],
        'Thursday',
        'Upper Body'
    );
    await workout.addWorkout(
        'Core',
        [{
            exercise: 'Crunches',
            weight: 120,
            sets: 5,
            reps: 30
        },
        {
            exercise: "Russian Twists",
            weight: 20,
            sets: 4,
            reps: 20
        },
        {
            exercise: 'Situps',
            weight: 120,
            sets: 5,
            reps: 20
        },
        {
            exercise: 'Bicycle Crunch',
            weight: 1,
            sets: 4,
            reps: 20
        },
        {
            exercise: 'Mountain Climber',
            weight: 1,
            sets: 5,
            reps: 30
        }],
        'Friday',
        'Core'
    );
    await workout.addWorkout(
        'Chest',
        [{
            exercise: 'Incline Bench Press',
            weight: 50,
            sets: 4,
            reps: 12
        },
        {
            exercise: 'Bench Press',
            weight: 75,
            sets: 4,
            reps: 12
        },
        {
            exercise: 'Dumbell Flys',
            weight: 20,
            sets: 5,
            reps: 15
        },
        {
            exercise: 'Standing Cable Decline Press',
            weight: 20,
            sets: 5,
            reps: 12
        },
        {
            exercise: 'Dumbell Bench Press',
            weight: 30,
            sets: 2,
            reps: 30
        }],
        'Saturday',
        'Upper Body'
    );
    console.log('Done seeding workout collection');

    // Generate 4 sample users
    const ron = await users.createUser(
        'ron',
        'rdumalag@stevens.edu',
        'Password123!'
    );
    const alice = await users.createUser(
        'alice',
        'alice@stevens.edu',
        'Password123!'
    );
    const bob = await users.createUser(
        'bob',
        'bob@stevens.edu',
        'Password123!'
    );
    const eve = await users.createUser(
        'eve',
        'eve@stevens.edu',
        'Password123!'
    );  
    console.log('Done generating sample users');

    // Fill user profiles
    await users.updateProfile(
        'ron',
        20,
        5,
        5,
        145,
        'Planet Fitness',
        'Your Mom',
        'Get jacked'
    );
    await users.updateProfile(
        'alice',
        21,
        5,
        2,
        120,
        'Crunch Fitness',
        'John Smith',
        'Squat 315 by the end of the month!'
    );
    await users.updateProfile(
        'bob',
        25,
        6,
        4,
        255,
        "Gold's Gym",
        'Ronnie Coleman',
        "BENCH 405 BY THE END OF THE WEEK. LIGHT WEIGHT, BABY. AIN'T NOTHIN' BUT A PEANUT!"
    );
    await users.updateProfile(
        'eve',
        22,
        5,
        7,
        145,
        'Equinox',
        'Analis Cruz',
        'Dumbbell Overhead Press with 50 lb. weights by the end of the year.'
    );
    console.log('Done filling sample user profiles');

  
    console.log('Done seeding database');
  
    await dbConnection.closeConnection();
  }
  
  main();