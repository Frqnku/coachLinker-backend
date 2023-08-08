const mongoose = require('mongoose');

const bookingsSchema = mongoose.Schema({
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students'
    },
    coachID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coachs'
    },
    date: String,
    startTime: String,
    coachingPlace: String,
    selectedSport: Array
});

const Bookings = mongoose.model('bookings', bookingsSchema);

module.exports = Bookings;