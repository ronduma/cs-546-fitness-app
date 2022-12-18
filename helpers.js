const {ObjectId} = require('mongodb');
const e = require("express");

function checkString(strVal, varName) {
  if (!strVal){
    if (/^[aeiou]$/.test(varName.charAt(0))){
      `Error: You must supply an ${varName}!`;
    }
    else{
      `Error: You must supply a ${varName}!`;
    }
  }
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0){
    if (varName === 'studio') throw 'Error: You must enter in a fitness studio / gym location.'
    else if (varName === 'coach') throw 'Error: You must enter in a coach / personal trainer.'
    else if (varName === 'goals') throw 'Error: You must enter in a personal fitness goal.'
    else throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  }
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
}
function checkNumber(numVal, varName) {
  if (!numVal) throw `Error: You must supply a ${varName}!`;
  numVal = parseInt(numVal);
  if (isNaN(numVal)) throw `Error: ${numVal} is not a valid value for ${varName} as it contains nondigits`;
  if (typeof numVal !== "number") throw `Error: ${varName} must be a number!`;
  if (varName === 'age' || varName === 'weight' || varName === 'heightFt' || varName === 'heightIn'){
    if (numVal < 0) throw 'Error: Numeric entries must be positive numbers.'
  }
  if (varName === 'heightIn'){
    if (numVal > 11) throw 'Error: heightIn must be a value between 0 and 11 (inclusive)'
  }
  return parseInt(numVal);
}
function checkNumGoal(numVal, varName){
  if (numVal === null) throw `Error: You must supply a ${varName}!`;
  numVal = parseInt(numVal);
  if (isNaN(numVal)) throw `Error: ${numVal} is not a valid value for ${varName} as it contains nondigits`;
  if (typeof numVal !== "number") throw `Error: ${varName} must be a number!`;
  if(numVal < 0) throw `Error: ${varName} must be a positive number!`;
  if(numVal > 35) throw `Error: You must have a realistic value for ${varName}. ${numVal} is too high!`
  return parseInt(numVal);
}
function checkPosNum(numVal, varName){
  numVal = checkNumber(numVal, varName);
  if(numVal <= 0) throw `Error: ${varName} must be a positive number!`
  return numVal
}
function checkId (id, varName){
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== 'string') throw `Error: ${varName} must be of type string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} must not be empty`;
  if(!ObjectId.isValid(ObjectId(id))) throw `${varName} must be a valid ObjectId`
  return id
}
function validateUsername(username){
  if (!username || !username.trim().length) throw 'Error: You must supply a username.'
  if (typeof username != "string"){
      throw 'Error: Username must be a string.'
  }
  username = username.trim().toLowerCase();
  if (username.length < 3){
      throw 'Error: Username must at least be 3 characters long.'
  }
  for (let i = 0; i < username.length; i++){
      if (!(username.charAt(i) >= 'a' && username.charAt(i) <= 'z') && !(username.charAt(i) >= '0' && username.charAt(i) <= '9')){
          throw 'Error: Username must only consist of alphanumeric characters.'
      }
  }
  return true
}
function validatePassword(password) {
  if (!password || !password.trim().length) throw 'Error: You must supply a password.';
  if (typeof password !== "string") throw 'Error: Password must be a string.';
  password = password.trim();
  //source for regex:
  //https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
  if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)) throw 'Error: Password should be at least 6 characters long, and have at least one uppercase character, one number and one special character.'
  return true;
}
function validateEmail(email) {
  if (!email || !email.trim().length) throw 'Error: You must supply an email.';
  if (typeof email !== "string") throw 'Error: Email must be a string.';
  email = email.trim();
  //email validation is near impossible, source for simple validation regex: 
  //https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw 'Error: Invalid email.'
  return true;
}
function checkStringHasAtPeriod(str) {
  let specialChar = /[.@]/;
  if (specialChar.test(str)) {
    return true;
  } else {
    return false;
  }
}
function checkStringHasSpecialChar(str) {
  let specialChar = /[`@#$%^&*()_+\-=\[\]{}"\\|<>\/~]/;
  if (specialChar.test(str)) {
    return true;
  } else {
    return false;
  }
}
function checkStringHasPunc(str) {
  let puncMarks = /[.,;:!?']/;
  if (puncMarks.test(str)) {
    return true;
  } else {
    return false;
  }
}
function checkHeight(height) {
  //Correct Format
  if (!height) throw `Error: You must supply a height}!`;
  if (typeof height !== "string") throw `Error: height must be a string!`;
  if (checkStringHasSpecialChar(height) || checkStringHasPunc(height)) {
    throw "Runtime has special characters or Punctuation.";
  }
  height = height.trim();

  //needs to have to two values: feet and inches
  let fheight = height.trim().split(" ");
  // console.log(cFormat);
  if (fheight.length != 2) {
    throw "Not correct format of ?ft ?in";
  }
  // console.log(isNaN(cFormat[1].slice(0,-3)));
  // console.log((parseInt(cFormat[0].slice(0,-1))));

  if (isNaN(fheight[0].slice(0, -2)) || isNaN(fheight[1].slice(0, -2))) {
    throw "Not correct format of ?ft ?in";
  }

  if (fheight[0].slice(-2) != "ft" || fheight[1].slice(-2) != "in") {
    throw "Not correct format";
  }

  //Checking the numbers
  validHeight = height
    .trim()
    .split("ft")
    .join(",")
    .split("in")
    .join()
    .split(",");

  validHeight.pop();
  // console.log(Vruntime);
  if (validHeight[0] == "" || validHeight[1] == "") {
    throw "Not valid 1h 30min format";
  }
  num_Ft = parseInt(validHeight[0]);
  num_In = parseInt(validHeight[1]);
  if (num_Ft == NaN || num_In == NaN) {
    throw "Runtime hrs or minutes is not given numbers";
  }
  if (num_Ft > 7 && num_Ft <= 0) {
    throw "Invalid input height is greater than 7feet";
    // Num_hr+=1;
    // Num_minutes=0;
  }
  if (num_In < 0 || num_In > 11) {
    throw "Invalid Negative input in inches or above 11";
  }
  return true;
}
function checkGoals(goals){
    if(!goals || !Array.isArray(goals) || goals == undefined){
        throw 'You must provide a array of goals for user';
    }
    for (elem of goals){
        if (typeof elem != 'string'){
            throw 'At least one of the goals is not in string form';
        }
        if (elem.trim().length == 0 || elem == ""){
            throw 'At least one of the goals is just empty string or empty spaces';
        }
    }
    return true;

}

//COMMUNITY POSTS
function validatePostTitle(postTitle){
  if (postTitle == undefined) {
    throw 'Must provide valid Post Title';
}
if (typeof postTitle != 'string') {
    throw 'Incorrect type'
}
if (postTitle.trim().length < 3) {
    throw 'Enter a Post Title minimum of 3 letters';
  }
  if (hasThreeWords(postTitle.trim()) != true){
    throw 'Error: PostTitle needs to be longer than 3 words'
  }
  if (ifstringonlynumbers(postTitle.trim()) == true || hasOnlySpecialCharater(postTitle.trim())== true){
    throw 'Error: PostTitle can not be only numbers or only special characters'
  }


return postTitle.trim();


}
function validatePostBody(postbody){
  if (postbody == undefined) {
    throw 'Must provide valid Post Details';
}
if (typeof postbody != 'string') {
    throw 'Incorrect type'
}
if (postbody.trim().length <5) {
    throw 'Enter a Post Details minimum of 5 letters';
  }
  if (ifstringonlynumbers(postbody.trim()) == true || hasOnlySpecialCharater(postbody.trim())== true){
    throw 'Error: PostBody can not be only numbers or only special characters'
  }
  if (hasfiveWords(postbody.trim()) != true){
    throw 'Error: postBody needs to be longer than 5 words'
  }

return postbody.trim();
}

function checkDay(day){
  let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if(!days.includes(day)){
    throw `${day} is not a valid day of the week`
  }
  return day;
}
function checkBodyGroup(group){
  let bodyGroups = ['Upper Body', 'Lower Body', 'Core'];
  if(!bodyGroups.includes(group)){
    throw `${group} is not a valid body group`
  }
  return group;

}
//CHECK FOR COMMENTS
function validateComment(commentBody){
  if (commentBody == undefined) {
    throw 'Must provide valid commentBody';
}
if (typeof commentBody != 'string') {
    throw 'Incorrect type'
}
if (commentBody.trim().length < 3) {
    throw 'Enter a commentBody minimum of 3 letters';
  }
  if (hasThreeWords(commentBody.trim()) != true){
    throw 'Error: Comment needs to be longer than 3 words'
  }
  if (ifstringonlynumbers(commentBody.trim()) == true || hasOnlySpecialCharater(commentBody.trim())== true){
    throw 'Error: Input can not be only numbers or only special characters'
  }
  return commentBody;

}

function ifstringonlynumbers(string){
  let regex = /^[0-9]+$/;
  return regex.test(string);
  
}
function hasOnlySpecialCharater(val) {
  let regex = /^[^a-zA-Z0-9]+$/;
  return (regex.test(val));
}
function hasThreeWords(str) {
  // Split the string into an array of words
  let words = str.split(' ');

  // Check the length of the array
  return words.length >= 3;
}
function hasfiveWords(str) {
  // Split the string into an array of words
  let words = str.split(' ');

  // Check the length of the array
  return words.length >= 5;
}


module.exports = {
  checkString,
  checkNumber,
  checkNumGoal,
  checkPosNum,
  checkId,
  validateUsername,
  validateEmail,
  validatePassword,
  checkStringHasAtPeriod,
  checkHeight,
  checkGoals,
  validatePostTitle,
  validatePostBody,
  checkDay,
  checkBodyGroup,
  validateComment,
  ifstringonlynumbers,
  hasOnlySpecialCharater,

};
