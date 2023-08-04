var express = require('express');
var router = express.Router();

const Student = require('../models/students');
const Coach = require('../models/coachs');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
  Coach.find()
  .then(data => {
    return data ? res.json({ result: true, data }) : res.json({ result: false, error: 'Aucun coach trouvé' })
  })
})

router.post('/new', (req, res) => {
  if (!checkBody(req.body, ['email', 'password', 'name', 'firstname', 'image', 'myDescription', 'teachedSport', 'proCard', 'siret', 'iban', 'bic', 'price', 'city'])) {
    return res.json({ result: false, error: 'Remplissez tous les champs de saisie' });
  }

  Student.findOne({email: req.body.email})
  .then(data => {
    if(data) {
      return res.json({result: false, error: 'Utilisateur déjà existant'})
    }

    Coach.findOne({email: req.body.email})
    .then(data => {
      if(data) {
        return res.json({result: false, error: 'Utilisateur déjà existant'})
      }

      const hash = bcrypt.hashSync(req.body.password, 10);

      const newCoach = new Coach({
        email: req.body.email,
        password: hash,
        token: uid2(32),
        isCoach : true,
        name: req.body.name,
        firstname: req.body.firstname,
        image: req.body.image,
        dateOfBirth: req.body.dateOfBirth,
        myDescription: req.body.myDescritpion,
        teachedSport: [req.body.teachedSport],
        proCard : req.body.proCard,
        siret : req.body.siret,
        iban : req.body.iban,
        bic : req.body.bic,
        price : req.body.price,
        notes : [],
        city: req.body.city,
        coachingPlaces: [req.body.coachingPlaces],
        isValidate: false,
      })
    
      newCoach.save()
      .then(coach => {
        return res.json({result: true, newCoach: coach})
      })
    })

  })
    
})

router.post('/update', (req, res) => {
  Coach.findOne({token : req.body.token})
  .then(data => {
    if (!data) {
      return res.json({ result: false, error: 'Utilisateur inexistant' });
    }

    req.body.image && (data.image = req.body.image)
    req.body.myDescription && (data.myDescription = req.body.myDescription)
    req.body.price && (data.price = req.body.price)
    req.body.city && (data.city = req.body.city)
    req.body.coachingPlaces && (data.coachingPlaces = [req.body.coachingPlaces])
    req.body.teachedSport && (data.teachedSport = [req.body.teachedSport])
    return res.json({ result: true, message: 'Informations mises à jour' });

  })
})

router.post('/validate', (req, res) => {
  Coach.findOne({token : req.body.token})
  .then(data => {
    if (!data) {
      return res.json({ result: false, error: 'Utilisateur inexistant' });
    }

    isValidate = true
    return res.json({ result: true, message: 'Profil coach validé' });

  })
})

module.exports = router;

