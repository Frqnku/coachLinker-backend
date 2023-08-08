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
    return data ? res.json({ result: true, data }) : res.json({ result: false, error: 'Aucun student trouvé' })
  })
})

router.post('/profil', (req, res) => {
  Student.findOne({token: req.body.token})
  .then(data => {
    return data ? res.json({ result: true, data }) : res.json({ result: false, error: 'Aucun student trouvé' })
  })
})

router.post('/new', (req, res) => {
  console.log(req.body)
  if (!checkBody(req.body, ['email', 'password', 'name', 'firstname', 'image', 'dateOfBirth', 'myDescription', 'favoriteSport'])) {
    return res.json({ result: false, error: 'Remplissez tous les champs de saisie' });
  }

  Student.findOne({email: req.body.email})
  .then(data => {
    if(data) {
      return res.json({result: false, error: 'Student déjà existant'})
    }

    Coach.findOne({email: req.body.email})
    .then(data => {
      if(data) {
        return res.json({result: false, error: 'Coach déjà existant'})
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
        myDescription: req.body.myDescription,
        favoriteSport: req.body.favoriteSport,
      })
    
      newStudent.save()
      .then(student => {
        return res.json({result: true, newStudent: student})
      })
    })
  })
})

router.post('/update', (req, res) => {
  const { token, image, myDescription, favoriteSport } = req.body;

  // Vérifier si le token est présent dans la requête
  if (!token) {
    return res.json({ result: false, error: 'Token manquant' });
  }

  // Construire les données à mettre à jour en fonction de ce qui est fourni dans la requête
  const updatedData = {};
  if (image) updatedData.image = image;
  if (myDescription) updatedData.myDescription = myDescription;
  if (favoriteSport) updatedData.favoriteSport = [favoriteSport];

  // Mettre à jour les données de le student dans la base de données
  Student.findOneAndUpdate(
    { token: token },
    { $set: updatedData },
    { new: true } // Pour renvoyer le document mis à jour
  )
    .then(updatedStudent => {
      if (!updatedStudent) {
        return res.json({ result: false, error: 'Utilisateur inexistant' });
      }
      return res.json({ result: true, message: 'Informations mises à jour' });
    })
    .catch(error => {
      console.error('Erreur lors de la mise à jour des informations:', error);
      return res.json({ result: false, error: 'Erreur de mise à jour' });
    });
});



















  //   Student.findOne({token : req.body.token})
//   .then(data => {
//     if (!data) {
//       return res.json({ result: false, error: 'Utilisateur inexistant' });
//     }

//     req.body.image && (data.image = req.body.image)
//     req.body.myDescription && (data.myDescription = req.body.myDescritpion)
//     req.body.favoriteSport && (data.favoriteSport = [req.body.favoriteSport])
//     return res.json({ result: true, message: 'Informations mises à jour' });

//   })
// })

module.exports = router;

