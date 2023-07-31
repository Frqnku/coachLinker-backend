const mongoose = require('mongoose');

const coachSchema = mongoose.Schema({
  name: String,
  firstname: String,
  image: String,
  dateOfBirth : Date,
  myDescription : String,
  teachSport : Array,  
  proCard : String,
  siret : Number, 
  iban : String,
  bic : String, 
  price : Number,
  notes : Array,
  agenda : Array,
  Id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  Id_planning: { type: mongoose.Schema.Types.ObjectId, ref: 'plannings' },
});

const Coach = mongoose.model('coachs', coachSchema);

module.exports = Coach;