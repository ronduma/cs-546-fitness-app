//Comments 
const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');
const { comments } = require('../config/mongoCollections');
const helpers = require('../helpers');


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
  
    let newComment = {
      _id : ObjectId(),
      postId: postId.trim(),
      user: user.trim(),
      comment: comment,
      time: currDate,
    };
    //update the post user 
    const insertedInfo = await commentCollection.insertOne(newComment);
    if(!insertedInfo.acknowledged || !insertedInfo.insertedId) throw 'Could not add Comment'

    return {insertedComment: true};
  }

module.exports = {
    searchCommentbyID,
    createComment,
    searchCommentbyPostId,
}
