var express = require('express');
var router = express.Router();

const Booking = require('../models/bookings')
const Student = require('../models/students')
const Coach = require('../models/coachs')
const { checkBody } = require("../modules/checkBody");
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')

// transporteur pour envoi d'email
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user:'coachlinker@gmail.com',
        pass: process.env.PWD_GMAIL
    }
})

// middleware pour envoyer l'email de confirmation
function sendConfirmationEmail(coachEmail, bookingDetails) {
    const templateHtml = fs.readFileSync("./models/template.html", "utf-8")
    const compiledTemplate = handlebars.compile(templateHtml)
    const html = compiledTemplate(bookingDetails)

    const mailOptions = {
        from: "coachlinker@gmail.com",
        to: coachEmail,
        subject: "Nouvelle réservation pour coaching",
        html: html,
    }

    // envoyer email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Erreur lors de l'envoi de l'email :", error)
        } else {
            console.log('Email envoyé:', info.response)
        }
    })
}

router.get('/student', (req, res) => {
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

router.get('/coach', (req, res) => {
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
                    if (data) {
                    // envoi de l'email de confirmation au coach
                    Coach.findById(req.body.coachID)
                    .then(coach => {
                        if (coach) {
                        const bookingDetails = {
                            date : req.body.date, /* a voir avec le groupe */
                            startTime: req.body.startTime,
                            endTime: req.body.endTime,
                            studentName: req.body.studentName,
                            coachingPlace: req.body.coachingPlace,
                            selectedSport: req.body.selectedSport
                        }
                        sendConfirmationEmail(coach.email, bookingDetails)
                        return res.json({result: true, data})
                   
                    }
                    }) 
                }
                })
            })    
        }    
    })    
})    

    
module.exports = router;
