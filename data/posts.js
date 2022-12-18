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
  let currDate = new Date();
  //console.log(currDate);

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
function sortbyDate( a, b ) {
  if ( a.postDate > b.postDate ){
    return -1;
  }
  if ( a.postDate < b.postDate ){
    return 1;
  }
  return 0;
}
function sortedDesc(array) {
  return array.sort(sortbyDate);
}

// const getDateOrderPosts = async (arrayofPosts) => {
//   if (arrayofPosts == []){
//     throw "No posts to order"
//   }
//   arrayofOrderedPosts = [];
//   for (let i = 0; i < arrayofPosts.length; i++) {
//     if (arrayofPosts[i].!=) {
//       for (let j = 0; j < userList[i].posts.length; j++) {
//         arrayofPosts.push(userList[i].posts[j]);
//       }
//     }
//   }
//   return arrayofPosts;
// };

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
  // const insertedInfo = await userCollection.updateOne({username:user.trim()},{$push: 
  //   {posts: newPost}}); 
  const deletePost = async(postId, username) =>{
    if(!postId || !username) throw 'no inputs';
    if(!helper.validateUsername(username)) throw 'Must have valid username';
    if (typeof postId !== 'string') throw 'Id must be a string';
    if (postId.trim().length === 0) throw 'Id cannot be an empty string or just spaces';
      postId = postId.trim();
      if (!ObjectId.isValid(postId)) throw 'invalid object ID';

      // deletes post
      let ID = null;
      
      let result = null;

      const current_user = await userData.getUserByUsername(username);

      let list_posts = current_user["posts"];
      for(let i =0; i < list_posts.length; i++){
        let a = list_posts[i];
        if(a._id.toString() === postId){
          result = current_user["posts"].slice(0,i).concat(current_user["posts"].slice(i+1,current_user["posts"].length));

          ID = current_user["_id"];
          break;
        }
      }


    if(ID === null) throw 'there is no user with this id';
    else{ 
      const userCollection = await userDatabase();
      await userCollection.updateOne({_id: ObjectId(ID)}, {$set:{posts: result}} );
      return {deletedPost: true};
    }
  };
//Get comment array from1 post
  const getComments = async (postId) => {
    if (!postId) throw 'You must provide an id to search for';
    if (typeof postId !== 'string') throw 'Id must be a string';
    if (postId.trim().length === 0)
        throw 'Id cannot be an empty string or just spaces';
    postId = postId.trim();
    if (!ObjectId.isValid(postId)) throw 'invalid object ID';
    let comments =[];
    let Post = await getPost(postId);
    //Empty comments
    if (Post.comments == []){
      return comments;

    }
    else {
      return Post.comments;

    }
  

  }


module.exports = {
    createPost,
    getAllPosts,
    getPost,
    getAllPostsNoUser,
    sortedDesc,
    deletePost,
    getComments,
};
