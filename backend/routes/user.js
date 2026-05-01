const express = require('express');
const { createBooking, getUserBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('USER'));

router.route('/bookings')
  .get(getUserBookings)
  .post(createBooking);

module.exports = router;
