const express = require('express');
const { getServices, addService, deleteService, getAllGarages, getGarageServices, getAllServices } = require('../controllers/garageController');
const { getGarageBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/all', getAllGarages);
router.get('/all-services', getAllServices);
router.get('/:id/services', getGarageServices);

// Protected routes (Garage Owner only)
router.use(protect);
router.use(authorize('GARAGE_OWNER'));

router.route('/services')
  .get(getServices)
  .post(addService);

router.delete('/services/:id', deleteService);

router.get('/bookings', getGarageBookings);
router.put('/bookings/:id', updateBookingStatus);

module.exports = router;
