const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  admin: { type: Boolean, default: false },
  first_name: { type: String, require: true, default: null },
  last_name: { type: String, require: true, default: null },
  email: { type: String, require: true, unique: true, default: null },
  password: { type: String, require: true,},
  favorites: {type: Array, default: [] }, 
});
module.exports = model("user", userSchema);