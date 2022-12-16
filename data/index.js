const userData=require('./users');
const postData=require('./posts');
const workoutData = require('./workouts');
const commentData = require('./comments');
module.exports = {
    users: userData,
    post: postData,
    workouts: workoutData,
    comments: commentData

}
