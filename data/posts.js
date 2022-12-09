const mongoCollections = require("../config/mongoCollections");
const helper = require("../helpers");
const userData = require("./users");
const userDatabase = mongoCollections.users;
const { ObjectId } = require("mongodb");

const createPost = async (user, postTitle, post) => {
  if (!user || user == undefined) {
    throw "user not provided";
  }
  if (typeof user != "string") {
    throw "You must provide user string";
  }
  await userData.getUserByUsername(user.trim());

  if (!postTitle || postTitle == undefined) {
    throw "You must provide a postTitle for user";
  }
  if (typeof postTitle != "string") {
    throw "You must provide a string for postTitle";
  }
  if (postTitle.trim().length == 0) {
    throw "Empty String or just just spaces";
  }
  if (typeof post != "string") {
    throw "You must provide a string for post";
  }
  if (post.trim().length == 0) {
    throw "Empty String or just just spaces for post";
  }
  const userCollection = await userDatabase();
  let currDate = new Date().toUTCString()

  let newPost = {
    _id : ObjectId(),
    username: user.trim(),
    postTitle: postTitle.trim(),
    postDate: currDate,
    post: post,
    likes: 0,
    comments: [],
    likeArray: [],
  };
  const insertedInfo = await userCollection.updateOne({username:user.trim()},{$push: 
    {posts: newPost}}); 

  return {insertedPost: true};

};
//Get all posts in db
const getAllPostsNoUser = async () => {
  const userCollection = await userDatabase();
  const userList = await userCollection.find({}).toArray();
  if (!userList) throw "Could not get any users";
  // console.log(movieList);
  arrayofPosts = [];
  for (let i = 0; i < userList.length; i++) {
    if (userList[i].posts != []) {
      for (let j = 0; j < userList[i].posts.length; j++) {
        arrayofPosts.push(userList[i].posts[j]);
      }
    }
  }
  return arrayofPosts;
};

//GIVEN user: _id objectID 
const getAllPosts = async (userId) => {
    if (!userId) throw 'You must provide an id to search for';
    if (typeof userId !== 'string') throw 'Id must be a string';
    if (userId.trim().length === 0)
      throw 'userId cannot be an empty string or just spaces';
      userId = userId.trim();
    if (!ObjectId.isValid(userId)) throw 'invalid object ID';

    //fetch all reviews
    const userCollection = await userDatabase();
    const userList = await userData.getUserById(userId);
    for (let i =0; i <userList.posts.length; i++){
        userList.posts[i]._id=userList.posts[i]._id.toString();
    }

    return userList.posts;
  };

  const OrderedAllPosts = async (userId) => {
    if (!userId) throw 'You must provide an id to search for';
    if (typeof userId !== 'string') throw 'Id must be a string';
    if (userId.trim().length === 0)
      throw 'userId cannot be an empty string or just spaces';
      userId = userId.trim();
    if (!ObjectId.isValid(userId)) throw 'invalid object ID';

    //fetch all reviews
    const userCollection = await userDatabase();
    const userList = await userData.getUserById(userId);
    for (let i =0; i <userList.posts.length; i++){
        userList.posts[i]._id=userList.posts[i]._id.toString();
    }

    return userList.posts;
  };

  const getPost = async (postId) => {
    if (!postId) throw 'You must provide an id to search for';
      if (typeof postId !== 'string') throw 'Id must be a string';
      if (postId.trim().length === 0)
        throw 'Id cannot be an empty string or just spaces';
        postId = postId.trim();
      if (!ObjectId.isValid(postId)) throw 'invalid object ID';
      //now get review
      let found =0;
      let postfound;
      const users= await userData.getAllUsers();
      for (const element of users){
        let postList=element.posts;
        for (iPost of postList){
          if (iPost._id.toString() == postId){
            found++;
            postfound=iPost;
            break;
  
          }
  
        }
      }
      if (found==0){
        throw'post not found';
      }
  //postfound returns the Entire post
      return postfound;
  
  };

module.exports = {
    createPost,
    getAllPosts,
    getPost,
    getAllPostsNoUser,

};
