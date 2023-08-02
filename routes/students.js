var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Student = require('../models/students');
const { checkBody } = require('../modules/checkBody');

// POST /profil => rajout données supplémentaires pour le student si pas déjà complété
router.post('/profil', (req, res) => {
    // Vérification si un utilisateur n'a pas déjà été enregistré
    User.findOne({ token: req.body.token })
      .then(data => {
        if (!data) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Recherche du student existant par son ID user
        Student.findOne({ Id_user: data._id })
          .then(existingStudent => {
            console.log(existingStudent)
            if (!existingStudent) {
              // Aucun student trouvé avec cet ID user, on en crée un nouveau
              const newStudent = new Student({
                name: req.body.name,
                firstname: req.body.firstname,
                image: req.body.image,
                dateOfBirth: req.body.dateOfBirth,
                myDescritpion: req.body.myDescritpion,
                favoriteSport: req.body.favoriteSport,
                Id_user: data._id,
              });
  
              newStudent.save()
                .then(newDoc => {
                  res.json({ result: true, student: newDoc });
                })
                .catch(error => {
                  res.status(500).json({ error: 'Failed to save student data' });
                });
            } else {
              req.body.name && (existingStudent.name = req.body.name)
              req.body.firstname && (existingStudent.firstname = req.body.firstname)
              req.body.image && (existingStudent.image = req.body.image)
              req.body.dateOfBirth && (existingStudent.dateOfBirth = req.body.dateOfBirth)
              req.body.myDescription && (existingStudent.myDescription = req.body.myDescritpion)
              req.body.favoriteSport && (existingStudent.favoriteSport = req.body.favoriteSport)
  
              existingStudent.save()
                .then(updatedDoc => {
                  res.json({ result: true, student: updatedDoc });
                })
                .catch(error => {
                  res.status(500).json({ error: 'Failed to update student data' });
                });
            }
          })
          .catch(error => {
            res.status(500).json({ error: 'Failed to find student by user ID' });
          });
      })
      .catch(error => {
        res.status(500).json({ error: 'Failed to find user by token' });
      });
  });




/* GET students listing. */
router.get('/', (req, res) => {
  Student.find() 
    .populate('Id_user') // Utilisez le nom du champ pour faire apparaitre la clé étrangère
    .then(data => {
        res.json({ result: true, data });
      })
      .catch(error => {
        res.status(500).json({ error: 'Failed to fetch students' });
      });
  });


/* DELETE user et son student lié. Vérification avec présence du token */
router.delete('/:token', async (req, res) => {
    try {
      // Recherche du student par son token
      const user = await User.findOne({ token: req.params.token });
      if (!user) {
        return res.json({ result: false, error: 'User not found' });
      }
  
      // étape 1 : Recherche du student lié à cet utilisateur
      const student = await Student.findOne({ Id_user: user._id });
      if (student) {
        // Suppression du student
        await Student.deleteOne({ _id: student._id });
      }
  
      // étape 2 : Suppression du user associé
      await User.deleteOne({ _id: user._id });
      
      return res.json({ result: true });
    } catch (error) {
      res.status(500).json({ result: false, error: 'Failed to delete user and associated student' });
    }
  });

  //Le mot-clé try est utilisé pour entourer le bloc de code où vous voulez essayer d'exécuter une ou plusieurs opérations potentiellement risquées (telles que l'accès à la base de données, la lecture de fichiers, etc.).
//Si une exception (erreur) est levée dans le bloc try lors de l'exécution des opérations, le flux de contrôle est transféré au bloc catch, sautant ainsi les autres instructions dans le bloc try.
//Le bloc catch est utilisé pour gérer l'exception et effectuer des actions de récupération appropriées. Il permet d'exécuter un autre bloc de code spécifique pour gérer l'erreur sans interrompre l'exécution du programme.
//Vous pouvez accéder à l'erreur dans le bloc catch en utilisant un paramètre (souvent nommé error ou err), qui contiendra l'objet d'erreur avec des informations sur ce qui a mal tourné.

module.exports = router;

