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

        const { lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche} = req.body.week

        const newPlanning = new Planning({
            coachID: data._id,
            days: [
                {
                    dayOfWeek: lundi.day,
                    startDay: lundi.day,
                    endDay: lundi.day
                },
                {
                    dayOfWeek: mardi.day,
                    startDay: mardi.day,
                    endDay: mardi.day
                },
                {
                    dayOfWeek: mercredi.day,
                    startDay: mercredi.day,
                    endDay: mercredi.day
                },
                {
                    dayOfWeek: jeudi.day,
                    startDay: jeudi.day,
                    endDay: jeudi.day
                },
                {
                    dayOfWeek: vendredi.day,
                    startDay: vendredi.day,
                    endDay: vendredi.day
                },
                {
                    dayOfWeek: samedi.day,
                    startDay: samedi.day,
                    endDay: samedi.day
                },
                {
                    dayOfWeek: dimanche.day,
                    startDay: dimanche.day,
                    endDay: dimanche.day
                },
            ]
        })    

        newPlanning.save()
        .then(data => {
            return res.json({result: true, data})
        })    
    })    
})

module.exports = router;
