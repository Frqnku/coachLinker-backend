const mongoose = require('mongoose');

// modèle clé étrangère bookings

const bookingsSchema = mongoose.Schema({
    start: String,
    end: String,
    price: Number,
    localisation: Array,
    Id_student: { type: mongoose.Schema.Types.ObjectId, ref: 'students'},
    Id_coach: { type: mongoose.Schema.Types.ObjectId, ref: 'coachs' }
});


// modif maud lundi soir : 

// const bookingsSchema = mongoose.Schema({
//     start: String,
//     end: String,
//     price: Number,
//     duration : Number,
//     status : String, enum :["pending", "confirmed","canceled"], default : "pending,"
//     localisation: Array,
//     Id_student: { type: mongoose.Schema.Types.ObjectId, ref: 'students'},
//     Id_coach: { type: mongoose.Schema.Types.ObjectId, ref: 'coachs' }
// });



const Bookings = mongoose.model('bookings', bookingsSchema);

module.exports = Bookings;