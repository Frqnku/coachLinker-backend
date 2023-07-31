const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  password: String,
  token: String,
  isValidate : Boolean,
});

const User = mongoose.model('users', userSchema);

module.exports = User;