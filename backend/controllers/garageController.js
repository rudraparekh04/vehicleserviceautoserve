const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Get all services for logged in garage owner
// @route   GET /api/garage/services
// @access  Private/GarageOwner
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ garageOwnerId: req.user.id });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Add a service
// @route   POST /api/garage/services
// @access  Private/GarageOwner
exports.addService = async (req, res) => {
  try {
    req.body.garageOwnerId = req.user.id;

    const service = await Service.create(req.body);

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete a service
// @route   DELETE /api/garage/services/:id
// @access  Private/GarageOwner
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    // Make sure user is service owner
    if (service.garageOwnerId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this service' });
    }

    await service.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all garages (public)
// @route   GET /api/garage/all
// @access  Public
exports.getAllGarages = async (req, res) => {
  try {
    const User = require('../models/User');
    const garages = await User.find({ role: 'GARAGE_OWNER', isApproved: true }).select('-password');
    res.status(200).json({ success: true, count: garages.length, data: garages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get services for a specific garage
// @route   GET /api/garage/:id/services
// @access  Public
exports.getGarageServices = async (req, res) => {
  try {
    const services = await Service.find({ garageOwnerId: req.params.id });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// @desc    Get all services globally
// @route   GET /api/garage/all-services
// @access  Public
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate({
      path: 'garageOwnerId',
      select: 'name email'
    });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
