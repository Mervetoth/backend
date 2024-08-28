const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    // Validate required fields
    const { firstName, lastName, email, password, gender, phoneNumber, roles } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !gender ||
      !phoneNumber
    ) {
      return res.status(400).send({ message: "Required fields are missing!" });
    }

    // Validate additional fields
    const validRoles = roles && Array.isArray(roles) ? roles : [];
    if (roles && !Array.isArray(roles)) {
      return res.status(400).send({ message: "Roles must be an array!" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "User already exists!" });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 8),
      gender,
      phoneNumber,
    });

    // Assign roles
    if (validRoles.length > 0) {
      const roles = await Role.find({ name: { $in: validRoles } });
      if (roles.length === 0) {
        return res.status(400).send({ message: "Invalid roles specified!" });
      }
      user.roles = roles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      if (!role) {
        return res.status(500).send({ message: "Default role not found!" });
      }
      user.roles = [role._id];
    }

    await user.save();
    res.status(201).send({ message: "User was registered successfully!" });
  } catch (err) {
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
    const user = await User.findOne({ email }).populate("roles", "-__v");
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Validate password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res
        .status(401)
        .send({ accessToken: null, message: "Invalid Password!" });
    }

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
