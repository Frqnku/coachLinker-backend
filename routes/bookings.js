var express = require('express');
var router = express.Router();

const Booking = require('../models/bookings')
const Student = require('../models/students')
const Coach = require('../models/coachs')
const { checkBody } = require("../modules/checkBody");

router.post('/student', (req, res) => {
    Student.findOne({token: req.body.token})
    .then(data => {
        if(!data) {
            return res.json({result: false, error: 'Aucun utilisateur trouvé'})
        }
        
        Booking.find({studentID: data._id})
        .populate('coachID', 'firstname image price')
        .then(bookings => {
            
            if(!bookings) {
                return res.json({result: false, error: 'Aucune réservation'})
            }
            return res.json({result: true, bookings})
        })
    })
})

router.post('/coach', (req, res) => {
    Coach.findOne({token: req.body.token})
    .then(data => {
        if(!data) {
            return res.json({result: false, error: 'Aucun utilisateur trouvé'})
        }

        Booking.find({studentID: data._id})
        .populate('studentID', 'firstname image dateOfBirth')
        .then(bookings => {
            return res.json({result: true, bookings})
        })
    })
})

router.post('/new', (req, res) => {
    if (!checkBody(req.body, ['date', 'startTime', 'endTime', 'coachingPlace'])) {
        return res.json({ result: false, error: 'Remplissez tous les champs de saisie' });
    }    

    Booking.findOne({coachID: req.body.coachID, date: req.body.date, startTime: req.body.startTime})
    .then(data => {
        if (data) {
            return res.json({ result: false, error: "La séance n'est plus disponible" });
        } else {
            Student.findOne({token : req.body.token})
            .then(data => {
                const newBooking = new Booking({
                    studentID: data._id,
                    coachID: req.body.coachID,
                    date: req.body.date,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    coachingPlace: req.body.coachingPlace,
                    selectedSport: req.body.selectedSport
                })    
    
                newBooking.save()
                .then(data => {
                    return res.json({result: true, data})
                })    
            })    
        }    
    })    
})    

module.exports = router;
