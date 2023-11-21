const express = require('express');
const { GET_USER_CART, ADD_TO_USER_CART, ADD_QUANTITY_OF_CART, REMOVE_QUANTITY_OF_CART, DELETE_CART } = require('../Controllers/CartController');
const router = express.Router();

router.post('/', ADD_TO_USER_CART);
router.get('/:userId', GET_USER_CART);
router.put('/AddQuantity/:cartId', ADD_QUANTITY_OF_CART);
router.put('/RemoveQuantity/:cartId', REMOVE_QUANTITY_OF_CART);
router.delete('/:cartId', DELETE_CART);

module.exports = router;