var express = require('express');
var router = express.Router();

const Planning = require('../models/plannings')
const Coach = require('../models/coachs');
const { checkBody } = require("../modules/checkBody");

router.get('/', (req, res) => {
    Planning.findOne({coachID: req.body.coachID})
    .then(data => {
        if(!data) {
            return res.json({result: false, error: 'Aucun planning trouvé'})
        }
        return res.json({result: true, data})
    })
})

router.post('/new', (req, res) => {
    if (!checkBody(req.body, ['token'])) {
        return res.json({ result: false, error: 'Remplissez tous les champs de saisie' });
    }

    Coach.findOne({token : req.body.token})
    .then(data => {
        if(!data) {
            return res.json({result: false, error: 'Aucun coach trouvé'})
        }
        const newPlanning = new Planning({
            coachID: data._id,
            days: [
                {
                    dayOfWeek: 'Lundi',
                    startDay: '09:00',
                    endDay: '19:00'
                },
                {
                    dayOfWeek: 'Mardi',
                    startDay: '09:00',
                    endDay: '19:00'
                },
                {
                    dayOfWeek: 'Mercredi',
                    startDay: '09:00',
                    endDay: '19:00'
                },
                {
                    dayOfWeek: 'Jeudi',
                    startDay: '09:00',
                    endDay: '19:00'
                },
                {
                    dayOfWeek: 'Vendredi',
                    startDay: '09:00',
                    endDay: '19:00'
                },
                {
                    dayOfWeek: 'Samedi',
                    startDay: '09:00',
                    endDay: '19:00'
                },
                {
                    dayOfWeek: 'Dimanche',
                    startDay: '09:00',
                    endDay: '19:00'
                }
            ]
        })    

        newPlanning.save()
        .then(data => {
            return res.json({result: true, data})
        })    
    })    
})

module.exports = router;
