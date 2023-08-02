const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
  name: String,
  firstname: String,
  image: String,
  dateOfBirth : Date,
  myDescription : String,
  favoriteSport : Array,  
  Id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

const Student = mongoose.model('students', studentSchema);

module.exports = Student;