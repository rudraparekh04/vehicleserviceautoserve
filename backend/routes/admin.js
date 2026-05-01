const express = require('express');
const { getPendingGarages, approveGarage, getUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize('ADMIN'));

router.get('/users', getUsers);
router.get('/garages/pending', getPendingGarages);
router.put('/approve-garage/:id', approveGarage);

module.exports = router;
