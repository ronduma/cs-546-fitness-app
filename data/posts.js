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
  helper.validatePostBody(post.trim());
  helper.validatePostTitle(postTitle);

  const userCollection = await userDatabase();
  const usern = await userData.getUserByUsername(user.trim());
  let currDate = new Date();
  //console.log(currDate);
  let allpost = await getAllPostsNoUser();
  for (elem of allpost){
    if (elem.postTitle.trim() == postTitle){
      throw "Error: Post with this title already exist!"
    }
  }
  let newPost = {
    _id: ObjectId(),
    username: usern.username,
    postTitle: postTitle.trim(),
    postDate: currDate,
    post: post.trim(),
    likes: 0,
    comments: [],
    likeArray: [],
  };
  const insertedInfo = await userCollection.updateOne({ username: usern.username.toLowerCase() }, {
    $push:
      { posts: newPost }
  });
  if(!insertedInfo.matchedCount && !insertedInfo.modifiedCount) throw 'Update failed';

  return { insertedPost: true };

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
function sortbyDate(a, b) {
  if (a.postDate > b.postDate) {
    return -1;
  }
  if (a.postDate < b.postDate) {
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
  for (let i = 0; i < userList.posts.length; i++) {
    userList.posts[i]._id = userList.posts[i]._id.toString();
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
  let found = 0;
  let postfound;
  const userCollection = await userDatabase();
  const users = await userData.getAllUsers();
  for (const element of users) {
    let postList = element.posts;
    for (iPost of postList) {
      if (iPost._id.toString() == postId) {
        found++;
        postfound = iPost;
        break;

      }

    }
  }
  if (found == 0) {
    throw 'post not found';
  }
  //postfound returns the Entire post
  return postfound;

};
const getpostByPosttitle = async (posttitle) => {
  if (!posttitle) throw 'You must provide an str to search for';
  if (typeof posttitle !== 'string') throw 'Id must be a string';
  if (posttitle.trim() === 0)
    throw 'str cannot be an empty string or just spaces';
    posttitle = posttitle.trim();
  helper.validatePostTitle(posttitle);
  const userCollection = await userDatabase();
  const users = await userData.getAllUsers();
  found=0;
  for (const element of users) {
    let postList = element.posts;
    for (iPost of postList) {
      if (iPost.postTitle == posttitle) {
        found++;
        postfound = iPost;
        break;
      }

    }
  }
  if (found == 0) {
    throw 'post not found';
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
  return postfound;
}

//Get comment array from1 post
const getComments = async (postId) => {
  if (!postId) throw 'You must provide an id to search for';
  if (typeof postId !== 'string') throw 'Id must be a string';
  if (postId.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  postId = postId.trim();
  if (!ObjectId.isValid(postId)) throw 'invalid object ID';
  let comments = [];
  let Post = await getPost(postId);
  //Empty comments
  if (Post.comments == []) {
    return comments;

  }
  else {
    return Post.comments;

  }


}
//number of likes the for req.session.user
const getLikesfromUsername = async (username) =>{
  if (!username) throw 'You must provide an username to search for';
  if (typeof username !== 'string') throw 'username must be a string';
  if (username.trim().length === 0)
    throw 'username cannot be an empty string or just spaces';
  username = username.toLowerCase();
  const userCollection = await userDatabase();
  const user = await userCollection.findOne({username: username});
  Totallikes=0;
  if (!user){throw 'Error: The given username does not match our records. Please try again.'}
  //user has been found from user -> check all post ->
  let posts = await getAllPostsNoUser();
  // console.log(posts);
  for (entry of posts){
    if (entry.username==username){
      if (entry.likes >0){
        Totallikes+=entry.likes;
      }
    }

  }
  return Totallikes;

}

const getLikes = async (postId) => {
  if (!postId) throw 'You must provide an id to search for';
  if (typeof postId !== 'string') throw 'Id must be a string';
  if (postId.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  postId = postId.trim();
  if (!ObjectId.isValid(postId)) throw 'invalid object ID';
  let Post = await getPost(postId);
  if (Post.likes == 0) {
    return 0;

  }
  else {
    return Post.likes;

  }

}

const getLikeArray = async (postId) => {
  if (!postId) throw 'You must provide an id to search for';
  if (typeof postId !== 'string') throw 'Id must be a string';
  if (postId.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  postId = postId.trim();
  if (!ObjectId.isValid(postId)) throw 'invalid object ID';
  const userCollection = await userDatabase();
  let Post = await getPost(postId);
  let likeArray = [];
  if (Post.likeArray == []) {
    return likeArray;
  }
  else {
    return Post.likeArray;
  }
}

//in order to add like we need the currentuser the Post we are liking
const addLike = async (currentuser, postuser, postId) => {
  if (!currentuser) throw 'You must be loginned in to like a post';
  if (typeof currentuser !== 'string') throw 'currentuser must be a string';
  if (!postuser) throw 'You must be loginned in to like a post';
  if (typeof postuser !== 'string') throw 'currentuser must be a string';
  // console.log(currentuser + postuser);
  if (postuser.toLowerCase() == currentuser.toLowerCase()) {
    throw 'Can not like your own post';
  }
  if (!postId) throw 'You must provide an id to search for';
  if (typeof postId !== 'string') throw 'Id must be a string';
  if (postId.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  postId = postId.trim();
  if (!ObjectId.isValid(postId)) throw 'invalid object ID';
  //ADD the like 
  const userCollection = await userDatabase();
  let post = await getPost(postId);
  let postlikes = await getLikes(postId);
  let newlikes = postlikes + 1;

  //We canAdd the Current username to likearray 
  let likeArray = await getLikeArray(postId);
  //console.log("hi");
  //console.log(likeArray);
  let newArray = likeArray;

  //Check duplicates I DONT WANT A USER Liking same post
  //
  if (newArray.length != 0){
    for (elem of newArray){
      //if current
      if (elem == currentuser){
        throw 'User can not like same post more than 1 time.'
      }
    }
  }
  newArray.push(currentuser);
  //Like number goes up 
  const insertedInfo = await userCollection.updateOne(
    { username: postuser, "posts._id": ObjectId(postId) }, {
    $set:
      { "posts.$.likes": newlikes, "posts.$.likeArray": newArray }
  }  // update
  );
  // console.log(insertedInfo);
  if (!insertedInfo.acknowledged || !insertedInfo.modifiedCount) {
    throw "Could not add like";
  }

  return { addedLike: true };
}



module.exports = {
  createPost,
  getAllPosts,
  getPost,
  getAllPostsNoUser,
  sortedDesc,
  getComments,
  getLikes,
  addLike,
  getLikesfromUsername,
  getpostByPosttitle,
  deletePost,
};
