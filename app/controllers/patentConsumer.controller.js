const PatentConsumer = require("../models/patentConsumer.model"); // Patent Consumer model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
exports.signupPatentConsumer = async (req, res) => {
  try {
    // Hash password, validate input, etc.
    const patentConsumer = new PatentConsumer({
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
    await patentConsumer.save();

    // Respond with success and token
    const token = jwt.sign({ id: patentConsumer._id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res
      .status(201)
      .send({ message: "Patent Consumer registered successfully!", token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Create a new Patent Consumer
exports.createPatentConsumer = async (req, res) => {
  try {
    const patentConsumer = new PatentConsumer(req.body);
    await patentConsumer.save();
    res.status(201).json(patentConsumer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Patent Consumers
exports.getPatentConsumers = async (req, res) => {
  try {
    const patentConsumers = await PatentConsumer.find().populate("requests.ip");
    res.status(200).json(patentConsumers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single Patent Consumer by ID
exports.getPatentConsumerById = async (req, res) => {
  try {
    const patentConsumer = await PatentConsumer.findById(
      req.params.id
    ).populate("requests.ip");
    if (!patentConsumer)
      return res.status(404).json({ message: "Patent Consumer not found" });
    res.status(200).json(patentConsumer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a Patent Consumer by ID
exports.updatePatentConsumer = async (req, res) => {
  try {
    const patentConsumer = await PatentConsumer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!patentConsumer)
      return res.status(404).json({ message: "Patent Consumer not found" });
    res.status(200).json(patentConsumer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Patent Consumer by ID
exports.deletePatentConsumer = async (req, res) => {
  try {
    const patentConsumer = await PatentConsumer.findByIdAndDelete(
      req.params.id
    );
    if (!patentConsumer)
      return res.status(404).json({ message: "Patent Consumer not found" });
    res.status(200).json({ message: "Patent Consumer deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
