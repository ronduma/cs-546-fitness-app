//Comments 
const helper = require('../helpers');
const postData = require('./posts');


const searchCommentbyPostID = async (postId) => {
    if (!postId){
        throw 'No postId provided'
    }
    if (typeof postId !== 'string') throw 'Id must be a string';
    if (postId.trim().length === 0)
        throw 'Id cannot be an empty string or just spaces';
    postId = postId.trim();
    if (!ObjectId.isValid(postId)) throw 'invalid object ID';

    
    const userCollection = await userDatabase();
    const userList = await userCollection.find({}).toArray();
    const foundpost = await postData.getPost(postId);
    
    

}

module.exports = {
    searchCommentbyPostID,
}
