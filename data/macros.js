// const {ObjectId} = require('mongodb');
// const mongoCollections = require("../config/mongoCollections");
// const helpers = require("../helpers");
// const users = mongoCollections.users;
// const users_js = require('./users');


// // gets the height, weight, and age
// const getInfo = async(userId) =>{
//     if(!userId){
//         throw 'Error: User Id does not exist';
//     }
//     if(typeof userId !== 'string' || userId.trim().length === 0){
//         throw 'Error: cannot have User Id as empty space';
//     }
//     userId = userId.trim();
//     if(!ObjectId.isValid(userId)) throw 'invalid object Id';

//     let person = await users_js.getUserById(userId);
//     let height = (person.heightFt * 12) + person.heightIn;
//     let weight = person.weight;
//     let age = person.age;

//     return [height, weight, age];
// };

// const getCalories = async(userId){
    
// }

// module.exports = {
//     getInfo
// }