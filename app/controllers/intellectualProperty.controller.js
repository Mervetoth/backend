const IntellectualProperty = require("../models/intellectualProperty.model");

// Get all intellectual properties
exports.getAllIntellectualProperties = async (req, res) => {
  try {
    const properties = await IntellectualProperty.find();

    if (properties.length === 0) {
      return res
        .status(404)
        .json({ message: "No intellectual properties found" });
    }

    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get intellectual property by ID
exports.getIntellectualPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await IntellectualProperty.findById(id);

    if (!property) {
      return res
        .status(404)
        .json({ message: "Intellectual Property not found" });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createIntellectualProperty = async (req, res) => {
  try {
    const {
      creator,
      owner,
      title,
      keywords,
      abstract,
      classification,
      blockchainHash,
      visibility,
    } = req.body;

    // Validate required fields
    if (
      !creator ||
      !owner ||
      !title ||
      !keywords ||
      !abstract ||
      !classification ||
      !blockchainHash
    ) {
      return res.status(400).json({ message: "Required fields are missing!" });
    }

    const newProperty = new IntellectualProperty({
      creator,
      owner,
      title,
      keywords,
      abstract,
      classification,
      blockchainHash, // Hash of IP details stored on blockchain
      visibility,
    });

    const result = await newProperty.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an existing intellectual property by ID
exports.updateIntellectualProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProperty = await IntellectualProperty.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        upsert: true,
        runValidators: true, // Ensure updated data adheres to schema
      }
    );

    if (!updatedProperty) {
      return res
        .status(404)
        .json({ message: "Intellectual Property not found" });
    }

    res.json(updatedProperty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteIntellectualProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedProperty = await IntellectualProperty.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res
        .status(404)
        .json({ message: "Intellectual Property not found" });
    }

    res.json({ message: "Intellectual Property deleted" });
  } catch (err) {
    console.error("Error deleting intellectual property:", err);
    res.status(500).json({ message: err.message });
  }
};
