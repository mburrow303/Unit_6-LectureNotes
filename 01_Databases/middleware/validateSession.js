const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function validateSession(req, res, next) {
 // Middleware is code that will run in between the request being made and the response being given from the endpoint
 // This will run before the function within an endpoint

 // Middleware has access to the request, response, and uses the "next" function to move forward in our program
 try {

 const token = req.headers.authorization;
 // console.log(token);

 const decoded = await jwt.verify(token, process.env.JWT); // use jsonwebtoken to verify our token
 // console.log(decoded);

// Make sure my id is valid within the database
//*const user = await User.findOne({_id: decoded.id});
const user = await User.findById(decoded.id);
// when I do not find a user with the id I am loking for, I am given the value "null", NOT an error
//console.log(user);
if(!user) throw new Error("User Not Found");
// by throwing this error, we can make sure we do not succeed our validation if the id is not in the database

// attach our user information to the request we are making
//console.log('Request user:', req.user);
// I can add information to the request which will be available when I get to my endpoint
req.user = user;

 return next(); // move from our middleware function to the router function
} catch (err) {
  res.status(403).json({message:err.message});
 } 
}

module.exports = validateSession;