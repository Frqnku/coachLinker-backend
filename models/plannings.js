const mongoose = require('mongoose');

const DaySchema = mongoose.Schema({
  dayOfWeek: String,
  startDay: String,
  endDay: String
})

const PlanningSchema = mongoose.Schema({
  coachID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "coachs"
  },
  days: [DaySchema]
});

const Planning = mongoose.model('plannings', PlanningSchema);

module.exports = Planning;