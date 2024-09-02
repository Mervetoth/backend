const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.user = require("./patentConsumer.model");
db.user = require("./patentCreator.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshToken.model");
db.intellectualProperty = require("./intellectualProperty.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
