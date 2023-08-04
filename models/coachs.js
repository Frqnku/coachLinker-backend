const mongoose = require('mongoose');

const coachSchema = mongoose.Schema({
  email: String,
  password: String,
  token: String,
  isCoach : Boolean,
  name: String,
  firstname: String,
  image: String,
  dateOfBirth : Date,
  myDescription : String,
  teachedSport : Array,
  proCard : String,
  siret : String, 
  iban : String,
  bic : String, 
  price : Number,
  notes : Array,
  city : String,
  coachingPlaces : Array,
  isValidate : Boolean,
});

const Coach = mongoose.model('coachs', coachSchema);

module.exports = Coach;