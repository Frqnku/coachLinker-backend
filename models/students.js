const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  email: String,
  password: String,
  token: String,
  isCoach : Boolean,
  name: String,
  firstname: String,
  image: String,
  dateOfBirth : Date,
  myDescription : String,
  favoriteSport : Array,
});

const Student = mongoose.model('students', studentSchema);

module.exports = Student;