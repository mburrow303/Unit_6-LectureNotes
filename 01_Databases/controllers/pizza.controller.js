const router = require('express').Router();
const Pizza = require('../models/pizza.model');
const User = require('../models/user.model');
const validateSession = require('../middleware/validateSession');

function errorResponse(res, err) {
  res.status(500).json({
    ERROR: err.message,
  });
};

//! Pizza Order - Add a new pizza to my Mongo Database
// to use middleware on a specific route, we must tell our code to run the middleware BEFORE we run our route's function
router.post('/order', validateSession, async (req, res) => {
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
 //console.log('user:', req.user.id); // hopefully this contains my user object   
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

// TODO PATCH One (Update One)
//* PUT endpoint will modify the entire "document" in the database, while a PATCH will only modify fields within a document

/*
PUT
let current = { id: 2, value: "something"}
let updated = { id: 2, value: "something-else"}

current = updated;

PATCH
let current = { id: 2, value: "something"}
let updated = { value: "something-else"}

* database will find the matching keys
current.value = updated.value
*/

//? /:id - is creating a parameter for our request
router.patch('/:id', validateSession, async(req, res) => {
 try {

  let _id = req.params.id;
  let owner = req.user.id;

  console.log(_id);
  console.log(owner);

  let updatedInfo = req.body;

  //? now that I can find the id and owner values, I want to find and update my pizza
  const updated = await Pizza.findOneAndUpdate({_id, owner}, updatedInfo, {new: true});

  if (!updated)
   throw new Error("Invalid Pizza/User Combination");

  res.status(200).json({
    message: `${updated._id} Updated`,
    updated
  });

  // res.send('Patch Endpoint'); //? this is temporary so we can console log our info  

  //* first version of try/catch 129-146 from notes commented out and redone on second lesson
  /// grab the value of id
  /// create a filter object
  //* const filter = {
  //   _id: req.params.id,
  //   owner: req.user.id,
  // };
  // const info = req.body;
  // const returnOptions = { new: true }
  // const updatedPizza = await Pizza.findOneAndUpdate(
  //   filter,
  //   info,
  //   returnOptions
  // )
  // res.status(200).json({
  //   message: 'Pizza Updated',
  //   updatedPizza
  //* })

 } catch (err) {
  errorResponse(res, err); 
 }
});


//  TODO DELETE One

//* First example done with Conor in class
/*
router.delete('/:id', async(req, res) => {
  try {
  const {id} = req.params
  const deletePizza = await Pizza.deleteOne({_id: id})

  deletePizza.deletedCount ?
   res.status(200).json({
    message: "Pizza Deleted"
   }) :
   res.status(404).json({
    message: "Pizza not deleted"
   })
  } catch (error) {
    res.status(500).json({
      error: error.message,
    })
  }
})
*/

//* Second example done with Jerome
router.delete('/:id', validateSession, async function (req, res) {
  try {
  // we need to know what we want to delete
  //let id = req.params.id;
  let {id} = req.params; //? put in an object so it can be destructured
  let owner = req.user.id;
  // locate and delete the item from our database
  const deletedPizza = await Pizza.deleteOne({_id: id, owner});
  // respond to our client
  if (!deletedPizza.deletedCount) {
   throw new Error('Pizza not found in database :(')
  } 
  

  res.status(200).json({
    message: 'Pizza Deleted!',
    deletedPizza
  });
  } catch(err) {
    errorResponse(res, err);
  }
})


module.exports = router;