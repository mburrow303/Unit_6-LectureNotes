/*
! CHALLENGE:
    - Add a boilerplate code for the controller
    - Create a POST method route ('/signup')
    - Make sure route is working
        - simple response of "Connected"
        -Test in Postman
    - full URL is:
        - localhost:4000/user/signup
*/

//? create a router
//const express = require('express');
//const router = express.Router();
const router = require('express').Router();
// To add items to our database, we need to know which model we are using. The model will determine which table to add our data to.
const User = require('../models/user.model');
//? npm install bcrypt
const bcrypt = require('bcrypt');

const encryptPassword = (password) => {
 const encrypt = bcrypt.hashSync(password, 10);
 console.log('ENCRYPT:', encrypt);
}

//? add endpoints
router.post('/signup', async (req, res) => {
  // res.send('Connected');
  // res.json(req.body);
  encryptPassword('myPassword');
  encryptPassword('myPassword');
  encryptPassword('new_Password');
  try {
  //* We can use a try/catch statement in a asynchronous function. As long as the code works normally without errors, we will always work in the "try" section. HOWEVER, once we get an error we will move to the "catch" section which will have access to the error

  // Create the new user
  const user = new User({
    firstName: req.body.first,
    lastName: req.body.last,
    email: req.body.mail,
    //password: req.body.pass
    password: bcrypt.hashSync(req.body.pass, 13)
  }); // use values from our request body to create a new User

  // Add the new user to the database
  const newUser = await user.save(); //* user.save() will write our new user to the database AND asynchronously give us back that entry FROM the database.

  // Send response to client
  res.status(200).json({
    user: newUser,
    message: 'Success! User Created!'
  })
  } catch (err) {
   res.status(500).json({
    ERROR: err.message
   })
  }
})

// login - written as an anonymous function rather than an arrow function
router.post('/login', async function(req, res) {
try {
 // 1 - we need access to the request body
 const {email, password} = req.body;
 //*const email = req.body.email;
 //*const password = req.body.password;

 // 2 - check if the email is in the database
 const user = await User.findOne({email: email});
 //* this is a MongoDB method that will look for a single item that matches a given query. This will typically be used to find some matching information such as an email or id. If no match exists, we will not get a value
 //console.log(user);
 // if there is not a user, make up an error
 // null is a falsey value, so if user is null this statement runs
 if (!user) throw new Error('Email or Password does not match'); 

 // 3 - create a json web token 

 // 4 - check if the passwords are the same
 const passwordMatch = await bcrypt.compare(password, user.password);
//* compare is going to use bcrypt to check if a given string, when hashed, matches the already hashed string in the second argument

 //console.log(passwordMatch);
 if (!passwordMatch) throw new Error('Email or Password does not match')

// 5 - send a response
res.status(200).json({
  message: 'Successful Login!',
  user
});
} catch (err) {
  res.status(500).json({
    ERROR: err.message
  })
 }
})

//? export to the router
module.exports = router;

//* in mongo db and mongoose the terms "data" & "entry" are interchangable, & "table" and "collection" are interchangable