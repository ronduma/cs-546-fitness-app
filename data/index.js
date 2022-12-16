const usersData=require('./users');
const postsData=require('./posts');
const workoutsData = require('./workouts');
const commentData = require('./comments');
module.exports = {
    users: usersData,
    post: postsData,
    workouts: workoutsData,
    comments: commentData,
};
