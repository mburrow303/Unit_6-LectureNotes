// require the use of the 'dotenv' package and configure my app to use those values
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express(); // app is our new instance of "express"
// const app = require('express')(); //? immediately create a new express app while "importing" that information. Will not give immediate access to express

const mongoose = require('mongoose');
//const MONGO = process.env.MONGO; //localhost:27017'; 
//const MONGO ='mongodb://localhost:27017'; //* connection string - the link to our database
// const MONGO ='mongodb://127.0.0.1:27017'; //! can change to this instead of line above if getting an error in connecting

const {PORT, MONGO} = process.env;
// destructure the PORT property from my env file - //*not required but can be useful
// use that link to actually connect with database
mongoose.connect(`${process.env.MONGO}/PizzaPlace`);

const db = mongoose.connection; // this is going to store our connection

// this will run a single time when we successfully connect to our database
db.once('open', () => console.log(`Connected to: ${MONGO}`));

//! without this line, I cannot access JSON data from a request
app.use(express.json());

const users = require('./controllers/user.controller');
const pizzas = require('./controllers/pizza.controller');
const validateSession = require('./middleware/validateSession');

app.use('/user', users);
// validate session middleware
app.use(validateSession); // All endpoints and routes below this line will require the validateSession middleware to run successfully before the endpoint runs
app.use('/pizza', pizzas);

app.get('/test', (req, res) => {
  res.status(200).json({message: "Server is accessible", port: process.env.PORT});
  //* process.env will access the ".env" file, and we can dot notation to get whatever specific value we want from that file
});

//app.listen(process.env.PORT); //* technically, this is all I need
app.listen(process.env.PORT, () => console.log(`App is listening on port ${process.env.PORT}`));