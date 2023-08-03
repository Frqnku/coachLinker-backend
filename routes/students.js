var express = require('express');
var router = express.Router();

const Student = require('../models/students');
const Coach = require('../models/coachs')
const { checkBody } = require('../modules/checkBody');

const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  Student.find()
  .then(data => {
    return data ? res.json({ result: true, data }) : res.json({ result: false, error: 'Aucun coach trouvé' })
  })
})

router.post('/new', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
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

      const newStudent = new Student({
        email: req.body.email,
        password: hash,
        token: uid2(32),
        isCoach : false,
        name: req.body.name,
        firstname: req.body.firstname,
        image: req.body.image,
        dateOfBirth: req.body.dateOfBirth,
        myDescription: req.body.myDescritpion,
        favoriteSport: [req.body.favoriteSport],
        bookings: [],
        chatRooms: []
      })
    
      newStudent.save()
      .then(student => {
        return res.json({result: true, newStudent: student})
      })
    })
  })
})

router.post('/update', (req, res) => {
  Student.findOne({token : req.body.token})
  .then(data => {
    if (!data) {
      return res.json({ result: false, error: 'Utilisateur inexistant' });
    }

    req.body.image && (data.image = req.body.image)
    req.body.myDescription && (data.myDescription = req.body.myDescritpion)
    req.body.favoriteSport && (data.favoriteSport = [req.body.favoriteSport])
    return res.json({ result: true, message: 'Informations mises à jour' });

  })
})

router.post('/newBooking', (req, res) => {
  Student.findOne({token : req.body.token})
  .then(data => {
    if (!data) {
      return res.json({ result: false, error: 'Utilisateur inexistant' });
    }

    data.bookings.push(req.body.booking)
    return res.json({ result: true, message: 'Nouvelle séance ajoutée' });
    
  })
})

router.post('/newChat', (req, res) => {
  Student.findOne({token : req.body.token})
  .then(data => {
    if (!data) {
      return res.json({ result: false, error: 'Utilisateur inexistant' });
    }

    data.chatRooms.push(req.body.chatRoom)
    return res.json({ result: true, message: 'Nouvelle chatRoom ajoutée' });

  })
})

module.exports = router;

