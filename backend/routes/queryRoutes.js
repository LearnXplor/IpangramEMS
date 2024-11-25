const express = require('express');
const { getITEmployeesByLocation, getSalesEmployeesSorted } = require('../controllers/queryController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/it-location', auth, getITEmployeesByLocation);
router.get('/sales-sorted', auth, getSalesEmployeesSorted);

module.exports = router;
