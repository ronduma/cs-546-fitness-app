const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const workout = data.workouts;

const main = async () => {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    const upper = await workout.addWorkout(
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
    const lower = await workout.addWorkout(
        'Lower Body',
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

    console.log('Done seeding workout collection');
    await dbConnection.closeConnection();
};

main().catch(console.log);