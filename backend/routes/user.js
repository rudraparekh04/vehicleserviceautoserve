const express = require('express');
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const { addVehicle, deleteVehicle, getVehicles } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('USER'));

router.route('/bookings')
  .get(getUserBookings)
  .post(createBooking);

router.route('/vehicles')
  .get(getVehicles)
  .post(addVehicle);

router.route('/vehicles/:vehicleId')
  .delete(deleteVehicle);

module.exports = router;
