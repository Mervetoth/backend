const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;
const PatentConsumer = require("../models/patentConsumer.model");
const PatentCreator = require("../models/patentCreator.model");

const bcrypt = require("bcryptjs"); // Make sure you use bcryptjs for consistency with hashing
const jwt = require("jsonwebtoken");
exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      gender,
      phoneNumber,
      roles,
      userType,

      address,
      dateOfBirth,
      designation,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !gender ||
      !phoneNumber ||
      !roles ||
      !userType ||
      !address ||
      !dateOfBirth ||
      !designation
    ) {
      return res.status(400).send({ message: "Required fields are missing!" });
    }

    if (roles && !Array.isArray(roles)) {
      return res.status(400).send({ message: "Roles must be an array!" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists!" });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    console.log("Hashed Password:", hashedPassword);
    let user;
    if (userType === "PatentCreator") {
      user = new PatentCreator({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        gender,
        phoneNumber,

        address,
        dateOfBirth,
        roles,
        userType,
        designation,
      });
    } else if (userType === "PatentConsumer") {
      user = new PatentConsumer({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        gender,
        phoneNumber,

        address,
        dateOfBirth,
        userType,
        designation,
        roles,
      });
    } else {
      return res.status(400).send({ message: "Invalid user type!" });
    }

    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      if (foundRoles.length === 0) {
        return res.status(400).send({ message: "Invalid roles specified!" });
      }
      user.roles = foundRoles.map((role) => role._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      user.roles = [defaultRole._id];
    }

    await user.save();
    res.status(201).send({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err); // Debugging info
    res.status(500).send({ message: `Server error: ${err.message}` });
  }
};

exports.signin = async (req, res) => {
  try {
    // Validate required fields
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "email and password are required!" });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() }).populate(
      "roles",
      "-__v"
    );
    console.log("user : ", user);

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    console.log("user pass : ", user.password);

    // Validate password
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res
        .status(401)
        .send({ accessToken: null, message: "Invalid Password!" });
    }
    console.log("ccccccccc", req.body.password);
    console.log("22222222", user.password);
    // Generate tokens
    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    let refreshToken = await db.refreshToken.createToken(user);

    // Prepare authorities
    let authorities = user.roles.map(
      (role) => "ROLE_" + role.name.toUpperCase()
    );

    res.status(200).send({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: authorities,
      accessToken: token,
      refreshToken: refreshToken,
      phoneNumber: user.phoneNumber,
      gender: user.gender,

      address: user.address,
      dateOfBirth: user.dateOfBirth,
      userType: user.userType,
      designation: user.designation,
    });
  } catch (err) {
    res.status(500).send({ message: `Server error: ${err.message}` });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      return res
        .status(403)
        .json({ message: "Refresh token is not in database!" });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();
      return res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      { expiresIn: config.jwtExpiration }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
