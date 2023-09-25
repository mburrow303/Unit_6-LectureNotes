const router = require('express').Router();
const Pizza = require('../models/pizza.model');
const User = require('../models/user.model');

function errorResponse(res, err) {
  res.status(500).json({
    ERROR: err.message,
  });
};

//! Pizza Order - Add a new pizza to my Mongo Database
router.post('/order', async (req, res) => {
  // res.send('Order Post Works!');
  try {
  //? 1. Check our model for what we need to order a pizza
  //  we need toppings - string, crust - string, slices - number
  const pizzaOrder = {
    calories: req.body.calories, //* still no calories even from postman, this is because our pizza model does not track calories
    toppings: req.body.toppings,
    crust: req.body.crust,
    slices: req.body.slices,
    // TODO tell my database who owns this pizza
    owner: req.user._id
  };

  //? 2. Creating a new Pizza document using the information from my request body
  const pizza = new Pizza(pizzaOrder);

  //? 3. Save this new Pizza document into my Mongo database
  const newPizza = await pizza.save(); // this needs to await since the .save() method gives me a prices
  // below example works we also re-wrote as an async function
  //newPizza.save().then(saved => {
   //res.status(200).json({saved});
  //});

  //? 4. Assuming our pizza was added to the database successfully, we send a response
  res.status(200).json({
    message: 'New Pizza Ordered!',
    order: newPizza
  });
 } catch (err) {
 errorResponse(res, err);
 }
});

// TODO GET One
//! Challenge Approaching
/* 
!   Challenge
        - By ID
        - Response should consider
            - If found
            - If no document found
        
        Hint: Consider login within user.controller.js
        Docs: https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/
*/

router.get('/order/:id', async(req, res) => {
  
  try {
   const singlePizza = await Pizza.findOne({_id:req.params.id});
   const user = await User.findById(singlePizza.owner);
  
   res.status(200).json({found: singlePizza, owner: user});
  } catch (err) { 
   errorResponse(res,err);
  }
});
 
// TODO GET All
router.get('/list', async(req, res) => {
  try {
 console.log('user:', req.user.id); // hopefully this contains my user object   
 const getAllPizzas = await Pizza.find(); // this should give me everything in the collection
  //console.log([] == true);
  // Make a ternary to handle whether or not we get pizzas
  getAllPizzas.length > 0 ?
   res.status(200).json({getAllPizzas})
   :
   res.status(404).json({message: "No Pizzas Found"})
  } catch (err) {
   errorResponse(res, err); 
  }
});

// TODO GET All with a Specific Crust

// TODO PUT  One (Update One)

//  TODO DELETE One


module.exports = router;