const User = require('../models/User');

// @desc    Add a vehicle to user's garage
// @route   POST /api/user/vehicles
// @access  Private
exports.addVehicle = async (req, res) => {
  try {
    const { make, model, year, licensePlate } = req.body;
    
    if (!make || !model || !year) {
      return res.status(400).json({ success: false, error: 'Please provide make, model, and year' });
    }

    const user = await User.findById(req.user.id);
    
    user.vehicles.push({ make, model, year, licensePlate });
    await user.save();

    res.status(200).json({ success: true, data: user.vehicles });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/user/vehicles/:vehicleId
// @access  Private
exports.deleteVehicle = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Filter out the vehicle to delete
    user.vehicles = user.vehicles.filter(
      vehicle => vehicle._id.toString() !== req.params.vehicleId
    );
    
    await user.save();

    res.status(200).json({ success: true, data: user.vehicles });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get user's vehicles
// @route   GET /api/user/vehicles
// @access  Private
exports.getVehicles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user.vehicles });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
