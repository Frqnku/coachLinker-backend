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
    console.log('hey')
    if (!checkBody(req.body, ['token', 'planning'])) {
        return res.json({ result: false, error: 'Remplissez tous les champs de saisie' });
    }

    
    Coach.findOne({ token: req.body.token })
    .then(data => {
        if (!data) {
            return res.json({ result: false, error: 'Aucun coach trouvé' });
        }

        const planning = req.body.planning;

        // check si coach a déjà un planning
        Planning.findOne({ coachID: data._id})
        .then(existingPlanning => {
            if (existingPlanning) {
                console.log('Planning existant')
                // si le planning existe déjà, met à jour le planning existant
                existingPlanning.days.forEach((day, i) => {
                    if (planning[day.dayOfWeek]) {
                        existingPlanning.days[i].startDay = planning[day.dayOfWeek].start || "9:00"
                        existingPlanning.days[i].endDay = planning[day.dayOfWeek].end || "12:00"
                    }
                    
                });

                existingPlanning.save()
                .then(updatedPlanning => {
                    return res.json({ result: true, data: updatedPlanning })
                })
                .catch(error => {
                    console.error('Erreur updating planning:', error)
                    return res.json({ result: false, error: 'Une erreurs s\'est produite lord de la mise à jour du planning'})
                })
                } else {
                    // s'il n'y a pas de planning existant, crée un nouveau planning
                    const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

                    const newPlanning = new Planning({
                    coachID: data._id,
                    days: daysOfWeek.map(day => ({
                        dayOfWeek: day,
                        startDay: planning.day ? planning.day.start : '9:00',
                        endDay: planning[day] ? planning[day].end : '12:00'
                    }))
                });

                newPlanning.save()
                .then(savedData => {
                    console.log(savedData);
                    return res.json({ result: true, data: savedData });
                })
                .catch(error => {
                    console.error('Error saving planning:', error);
                    return res.json({ result: false, error: 'Une erreur s\'est produite lors de l\'enregistrement du planning' });
                });
            }
        })
        .catch(error => {
            console.error('Error finding planning:', error)
            return res.json({ result: false, error: 'Une erreur s\'est produite lors de la recherche du planning' })
        })      
    })
    .catch(error => {
        console.error('Error finding coach:', error);
        return res.json({ result: false, error: 'Une erreur s\'est produite lors de la recherche du coach' });
    });
});

module.exports = router;
