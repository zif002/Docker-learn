const User = require("../models/userModel")
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res, err) => {
  const {username, password} = req.body
  const hashPassword = await bcrypt.hash(password, 12)
  try {
    const newUser = await User.create({
      username,
      password: hashPassword
    })
    res.status(201).
      send({
        status: "success",
        data: {
          user: newUser
        }
      })
  } catch (e) {
    console.log(e)
    res.status(400).
    json({
      status: "fail"
    })
  }
}

exports.login = async (req, res, err) => {
  const {username, password} = req.body
  try {
    const user = await User.findOne({
      username
    })
    if(!user) {
      res.status(404).json({
        status: "fail",
        message: "user not found"
      })
    }
    const isCorrect = await bcrypt.compare(password, user.password)
    if(isCorrect) {
      req.session.user = user;
      res.status(200).
      send({
        status: "success",
      })
    } else {
      res.status(400).
      send({
        status: "success",
        message: "incorrect username or password"
      })
    }
  } catch (e) {
    console.log(e)
    res.status(400).
    json({
      status: "fail"
    })
  }
}