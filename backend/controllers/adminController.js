const User = require('../models/User');
const Supplier = require('../models/Supplier');

// @desc    Get all pending garage owners
// @route   GET /api/admin/garages/pending
// @access  Private/Admin
exports.getPendingGarages = async (req, res) => {
  try {
    const garages = await User.find({ role: 'GARAGE_OWNER', isApproved: false });
    res.status(200).json({ success: true, count: garages.length, data: garages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Approve a garage owner
// @route   PUT /api/admin/garages/:id/approve
// @access  Private/Admin
exports.approveGarage = async (req, res) => {
  try {
    if (!req.params.id) {
        return res.status(400).json({ success: false, error: 'No ID provided' });
    }
    const garage = await User.findById(req.params.id);

    if (!garage) {
      return res.status(404).json({ success: false, error: 'Garage not found' });
    }

    if (garage.role !== 'GARAGE_OWNER') {
      return res.status(400).json({ success: false, error: 'User is not a garage owner' });
    }

    garage.isApproved = true;
    await garage.save();

    // Create or update entry in Supplier collection
    await Supplier.findOneAndUpdate(
      { user: garage._id },
      {
        name: garage.name,
        email: garage.email,
        status: 'Active'
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: garage });
  } catch (err) {
    console.error('Approve Garage Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
