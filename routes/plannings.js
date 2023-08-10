var express = require('express');
var router = express.Router();

const Planning = require('../models/plannings')
const Coach = require('../models/coachs');
const { checkBody } = require("../modules/checkBody");

router.post('/', (req, res) => {
    Planning.findOne({coachID: req.body.coachID})
    .then(data => {
        if(!data) {
            return res.json({result: false, error: 'Aucun planning trouvé'})
        }
        return res.json({result: true, data})
    })
})

router.post('/new', (req, res) => {
    if (!checkBody(req.body, ['token', 'planning'])) {
        return res.json({ result: false, error: 'Remplissez tous les champs de saisie' });
    }

    
    Coach.findOne({ token: req.body.token })
    .then(data => {
        if (!data) {
            return res.json({ result: false, error: 'Aucun coach trouvé' });
        }
        console.log(req.body)

        const planning = req.body.planning;
        const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
        
        // check si coach a déjà un planning
        Planning.findOne({ coachID: data._id})
        .then(existingPlanning => {
            if (existingPlanning) {
                console.log('exist', existingPlanning, 'exist')
                // si le planning existe déjà, met à jour le planning existant
                existingPlanning.days.forEach((day, i) => {
                    console.log(planning[i])
                    if (planning[i]) {
                        existingPlanning.days[i].startDay = planning[i].start || ""
                        existingPlanning.days[i].endDay = planning[i].end || ""
                    }
                    
                });

                existingPlanning.save()
                .then(updatedPlanning => {
                    return res.json({ result: true, data: updatedPlanning })
                })

            } else {
                console.log(data)
                    const newPlanning = new Planning({
                    coachID: data._id,
                    days: daysOfWeek.map((day, i) => ({
                        dayOfWeek: day,
                        startDay: planning[i].start ? planning[i].start : '',
                        endDay: planning[i].end ? planning[i].end : ''
                    }))
                });

                newPlanning.save()
                .then(savedData => {
                    console.log(savedData);
                    return res.json({ result: true, data: savedData });
                })
            }
        })
    })
});

module.exports = router;
