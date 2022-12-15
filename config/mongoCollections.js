const dbConnection = require('./mongoConnection');


const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// /* Now, you can list your collections here: 
// NOTE: YOU WILL NEED TO CHANGE THE CODE BELOW TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT */
module.exports = {
  users: getCollectionFn('user_collection'),
  workouts: getCollectionFn('workout_collection')
  
};
