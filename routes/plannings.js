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
                .catch(error => {
                    console.error('Erreur updating planning:', error)
                    return res.json({ result: false, error: 'Une erreurs s\'est produite lord de la mise à jour du planning'})
                })
                } else {
                    // s'il n'y a pas de planning existant, crée un nouveau planning
                    

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
