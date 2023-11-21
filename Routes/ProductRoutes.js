const express = require('express');
const data = require('../config/data');
const router = express.Router();

router.get('/', (req, res) => { res.json(data) });

module.exports = router;