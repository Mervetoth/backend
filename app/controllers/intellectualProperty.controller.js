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

// Create a new intellectual property
exports.createIntellectualProperty = async (req, res) => {
  try {
    const { title, description, status, documentUrl } = req.body;
    const newProperty = new IntellectualProperty({
      title,
      description,
      status,
      documentUrl,
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

// Delete an intellectual property by ID
exports.deleteIntellectualProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProperty = await IntellectualProperty.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res
        .status(404)
        .json({ message: "Intellectual Property not found" });
    }

    res.json({ message: "Intellectual Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
