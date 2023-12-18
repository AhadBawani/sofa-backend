const express = require('express');
const { PLACE_ORDER, DELIVERED_ORDER, DELETE_ORDER, GET_ALL_ORDER, GET_USER_ORDER_BY_ID } = require('../Controllers/OrderController');
const router = express.Router();


router.post('/', PLACE_ORDER);
router.get('/:userId', GET_ALL_ORDER);
router.get('/user/:userId', GET_USER_ORDER_BY_ID);
router.put('/:userId', DELIVERED_ORDER);
router.put('/delete/:userId', DELETE_ORDER);

module.exports = router;