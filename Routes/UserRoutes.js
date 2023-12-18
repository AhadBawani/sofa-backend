const express = require('express');
const { SIGNUP_USER, LOGIN_USER, GET_USER_BY_ID } = require('../Controllers/UserController');
const router = express.Router();

router.post('/signup', SIGNUP_USER);
router.post('/login', LOGIN_USER);
router.get('/:userId', GET_USER_BY_ID);

module.exports = router;