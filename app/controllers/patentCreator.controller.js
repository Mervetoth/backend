const PatentCreator = require("../models/patentCreator.model"); // Patent Creator model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
exports.signupPatentCreator = async (req, res) => {
  try {
    // Hash password, validate input, etc.
    const patentCreator = new PatentCreator({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      dateOfBirth: req.body.dateOfBirth,
      designation: req.body.designation,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8), // Password hashing
    });

    // Save to database
    await patentCreator.save();

    // Respond with success and token
    const token = jwt.sign({ id: patentCreator._id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res
      .status(201)
      .send({ message: "Patent Creator registered successfully!", token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Create a new Patent Creator
exports.createPatentCreator = async (req, res) => {
  try {
    const patentCreator = new PatentCreator(req.body);
    await patentCreator.save();
    res.status(201).json(patentCreator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Patent Creators
exports.getPatentCreators = async (req, res) => {
  try {
    const patentCreators = await PatentCreator.find().populate("ips");
    res.status(200).json(patentCreators);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single Patent Creator by ID
exports.getPatentCreatorById = async (req, res) => {
  try {
    const patentCreator = await PatentCreator.findById(req.params.id).populate(
      "ips"
    );
    if (!patentCreator)
      return res.status(404).json({ message: "Patent Creator not found" });
    res.status(200).json(patentCreator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Patent Creator by ID
exports.updatePatentCreator = async (req, res) => {
  try {
    const patentCreator = await PatentCreator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!patentCreator)
      return res.status(404).json({ message: "Patent Creator not found" });
    res.status(200).json(patentCreator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Patent Creator by ID
exports.deletePatentCreator = async (req, res) => {
  try {
    const patentCreator = await PatentCreator.findByIdAndDelete(req.params.id);
    if (!patentCreator)
      return res.status(404).json({ message: "Patent Creator not found" });
    res.status(200).json({ message: "Patent Creator deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
