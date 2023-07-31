// var express = require('express');
// var router = express.Router();

// require('../models/connection');
// const User = require('../models/users');
// const Student = require('../models/students');
// const { checkBody } = require('../modules/checkBody');


// // POST /profil => rajout données supplémentaires pour le student
// router.post('/profil', (req, res) => {

// // vérification si un utilisateur n'a pas déjà été enregistré
// //   User.findOne({ email: req.body.email }).then(data => {
// //     if (data === null) {
//       const newStudent = new Student({
//         name: req.body.name,
//         firstname: req.body.firstname,
//         image: req.body.image,
//         dateOfBirth : req.body.date,
//         myDescritpion : req.body.myDescription,
//         favoriteSport : Array,  
//         Id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
//       });

//       newStudent.save().then(newDoc => {
//         res.json({ result: true});
//       });
//     } else {

// // User already exists in database
//       res.json({ result: false, error: 'User already exists' });
//     }



// /* GET users listing. vérification avec présence du token */
// router.get('/:token', (req, res) => {
//   User.findOne({ token: req.params.token }).then(data => {
//     if (data) {
//       res.json({ result: true, isValidate: data.isValidate });
//     } else {
//       res.json({ result: false, error: 'User not found' });
//     }
//   });
// });


// /* DELETE users. vérification avec présence du token */
// router.delete('/:token', (req, res) => {
//   User.findOne({ token: req.params.token }).then(data => {
//     if (data) {
//       res.json({ result: true, isValidate: data.isValidate });
//     } else {
//       res.json({ result: false, error: 'User not found' });
//     }
//   });
// });


// module.exports = router;
