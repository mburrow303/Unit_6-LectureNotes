/*
    ! Challenge
        - create a new model defining pizzas. this model should have
            - toppings (string)
            - crust (string)
            - slices (number)
        - create a pizza controller
            - this will have an endpoint to post a new order (new pizza entry) to the database
            - the link for this endpoint should be:
                `localhost:4000/pizza/order`
*/

const mongoose = require('mongoose');

const PizzaSchema = new mongoose.Schema({
  toppings: String,
  crust: {
    type: String,
    required: false // NOTE: required is false by default
  },  
  slices: Number
  
});

module.exports = mongoose.model('Pizza', PizzaSchema);