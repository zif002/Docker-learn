const mongoose = require("mongoose")

const user = new mongoose.Schema({
  username: {
    type: String,
    require: [true, 'User must have a username'],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "User have must a string"]
  }
})

const User = mongoose.model("User", user)

module.exports = User