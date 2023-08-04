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
        console.log(planning)

        console.log(planning['Lundi'].start)

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
    })
    .catch(error => {
        console.error('Error finding coach:', error);
        return res.json({ result: false, error: 'Une erreur s\'est produite lors de la recherche du coach' });
    });
});

module.exports = router;
