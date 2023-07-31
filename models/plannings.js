const mongoose = require('mongoose');

// modèle sous document pour planning

const daysSchema = mongoose.Schema({
    startDay: String,
    endDay: String
})

const planningsSchema = mongoose.Schema({
  monday: daysSchema,
  tuesday: daysSchema,
  wednesday: daysSchema,
  thursday: daysSchema,
  friday: daysSchema,
  saturday: daysSchema,
  sunday: daysSchema,
  exceptions: daysSchema,
});

const Plannings = mongoose.model('plannings', planningsSchema);

module.exports = Plannings;