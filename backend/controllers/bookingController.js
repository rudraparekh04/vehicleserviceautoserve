const Booking = require('../models/Booking');

// @desc    Book a service
// @route   POST /api/user/bookings
// @access  Private/User
exports.createBooking = async (req, res) => {
  try {
    const { garageId, serviceId, date } = req.body;

    const booking = await Booking.create({
      userId: req.user.id,
      garageId,
      serviceId,
      date
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/user/bookings
// @access  Private/User
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: 'garageId',
        select: 'name email'
      })
      .populate({
        path: 'serviceId',
        select: 'name price duration'
      });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get garage's bookings
// @route   GET /api/garage/bookings
// @access  Private/GarageOwner
exports.getGarageBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ garageId: req.user.id })
      .populate({
        path: 'userId',
        select: 'name email'
      })
      .populate({
        path: 'serviceId',
        select: 'name price duration'
      });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/garage/bookings/:id
// @access  Private/GarageOwner
exports.updateBookingStatus = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.garageId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
