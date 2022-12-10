const emailValidator = require("email-validator");
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
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
}
function checkNumber(numVal, varName) {
  if (!numVal) throw `Error: You must supply a ${varName}!`;
  if (typeof numVal !== "number") throw `Error: ${varName} must be a number!`;

  if (isNaN(numVal))
    throw `Error: ${numVal} is not a valid value for ${varName} as it only contains nondigits`;

  numVal = parseInt(numVal);

  if (typeof numVal !== "number") throw `Error: ${varName} must be a number!`;

  return parseInt(numVal);
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
  if (!username) throw 'Error: You must supply a username.'
  if (typeof username != "string"){
      throw 'Error: Username must be a string.'
  }
  username = username.toLowerCase();
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
  if (!password) throw `Error: You must supply a password.`;
  if (typeof password !== "string") throw `Error: Password must be a string.`;
  //source for regex
  //https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
  if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)) throw 'Error: Password should be at least 6 characters long, and have at least one uppercase character, one number and one special character.'
  return true;
}
function validateEmail(email) {
  return emailValidator.validate(email);
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
function checkDay(day){
  let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  if(!days.includes(day)){
    throw `${day} is not a valid day of the week`
  }
  return day;
}
module.exports = {
  checkString,
  checkNumber,
  checkId,
  validateUsername,
  validateEmail,
  validatePassword,
  checkStringHasAtPeriod,
  checkHeight,
  checkGoals,
  checkDay
};
