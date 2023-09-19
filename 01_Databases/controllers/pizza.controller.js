const router = require('express').Router();
const Pizza = require('../models/pizza.model');

router.post('/order', (req, res) => {
  res.send('Order Post Works!');
})

module.exports = router;