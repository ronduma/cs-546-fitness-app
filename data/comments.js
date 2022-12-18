//Comments 
const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const { comments } = require('../config/mongoCollections');
const helpers = require('../helpers');
const { users } = require('../config/mongoCollections');
const postData = require('./posts');
const userData = require('./users');


const searchCommentbyID = async (commentid) => {
    commentid = helpers.checkId(commentid);
    const commentCollection = await comments();
    const thisComment = await commentCollection.findOne({_id: ObjectId(commentid)});
    if(thisComment === null) throw 'No comment exists with the given commentid';
    thisComment._id = thisComment._id.toString();
    return thisComment;
}

const getAllComments = async () => {
    const commentCollection = await comments();
    const commentList = await commentCollection.find({}).toArray();
    if (!commentList) throw "Could not get all users";
    // console.log(movieList); 
    for (let i = 0; i < commentList.length; i++) {
        commentList[i]._id = commentList[i]._id.toString();
    }
    return commentList;
  };

const searchCommentbyPostId = async (postId) => {
    postId = helpers.checkId(postId);
    let allcomments = await getAllComments();
    let commentList=[];

    for (elem of allcomments){
        if (postId == elem.postId){
            commentList.push(elem);
        }
    }
    if(commentList === []){
        return [];
    }
    return commentList;
}
//Create comment 
const createComment = async(postId, user, comment) => {
    //need the current user
    const commentCollection = await comments();
    const userCollection = await users();
    // const userCollection = await users();
    if (!user || user == undefined) {
      throw "user not provided";
    }
    if (typeof user != "string") {
      throw "You must provide user string";
    }
    if (!comment || comment == undefined) {
      throw "You must provide a Comment for user";
    }
    if (typeof comment != "string") {
      throw "You must provide a string for Comment";
    }
    if (comment.trim().length == 0) {
      throw "Empty String or just just spaces";
    }
    if (!postId) throw 'You must provide an id to search for';
    if (typeof postId !== 'string') throw 'Id must be a string';
    if (postId.trim().length === 0) throw 'Id cannot be an empty string or just spaces';
    postId = postId.trim();
    if (!ObjectId.isValid(postId)) throw 'invalid object ID';
    //check if postuser and user is the same. Cant comment on your own post
    let currDate = new Date();
    //console.log(currDate);
    const commentExist = await commentCollection.findOne({comment: comment.trim()});
    if (commentExist){throw 'Error: Comment already exists!'}
    helpers.validateComment(comment);
    let newComment = {
      _id : ObjectId(),
      postId: postId.trim(),
      user: user.trim().toLowerCase(),
      comment: comment.trim(),
      time: currDate,
    };
    //user exist
    const dupuser = await userCollection.findOne({username: newComment.user});
    const post = await postData.getPost(newComment.postId)
    // console.log(post.username)
    if (newComment.user == post.username){
      throw 'Error: Can not comment on your own post';
    }

    const insertedInfo = await commentCollection.insertOne(newComment);
    if(!insertedInfo.acknowledged || !insertedInfo.insertedId) throw 'Could not add Comment'

    return {insertedComment: true};
  }

  //get all comments by a user
  const getAllCommentsCountByUser = async (username) => {
  if (!username) throw 'You must provide an username to search for';
  if (typeof username !== 'string') throw 'username must be a string';
  if (username.trim().length === 0)
    throw 'username cannot be an empty string or just spaces';
  username = username.toLowerCase();
  const commentCollection = await comments();
  let allComments = await getAllComments();
  //allcomments -> each comment has username check username and username 
  const userCollection = await users();
  let databaseUser = await userData.getUserByUsername(username.trim().toLowerCase());
  let count =0;
  for (commentvalue of allComments){
    // console.log(comment)

    if (commentvalue.user == username){
      count++;
    }
  }
  return count;
  
  }

module.exports = {
    searchCommentbyID,
    createComment,
    searchCommentbyPostId,
    getAllCommentsCountByUser,
    getAllComments,
}
