var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const Coach = require('../models/coachs');
const { checkBody } = require('../modules/checkBody');

// POST /profil => rajout données supplémentaires pour le coach si pas déjà complété
router.post('/profil', (req, res) => {
    // Vérification si un utilisateur n'a pas déjà été enregistré
    User.findOne({ token: req.body.token })
      .then(data => {
        if (!data) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Recherche du coach existant par son ID user
        Coach.findOne({ Id_user: data._id })
          .then(existingCoach => {
            if (!existingCoach) {
              // Aucun coach trouvé avec cet ID user, on en crée un nouveau
              const newCoach = new Coach({
                name: req.body.name,
                firstname: req.body.firstname,
                image: req.body.image,
                dateOfBirth: req.body.dateOfBirth,
                myDescription: req.body.myDescription,
                teachSport: req.body.teachSport,
                proCard : req.body.proCard,
                siret : req.body.siret,
                iban : req.body.iban,
                bic : req.body.bic,
                price : req.body.price,
                notes : req.body.notes,
                agenda : req.body.agenda,
                Id_user: data._id,
                Id_planning: data._id, // à modifier !!
              });
  
              newCoach.save()
                .then(newDoc => {
                  res.json({ result: true, coach: newDoc });
                })
                .catch(error => {
                  res.status(500).json({ error: 'Failed to save coach data' });
                });
            } else {
              // Un coach existe déjà avec cet ID user, on met à jour ses données
              existingCoach.name = req.body.name,
              existingCoach.firstname = req.body.firstname,
              existingCoach.image = req.body.image,
              existingCoach.dateOfBirth = req.body.dateOfBirth,
              existingCoach.myDescritpion = req.body.myDescription,
              existingCoach.teachSport = req.body.teachSport,
              existingCoach.proCard =  req.body.proCard,
              existingCoach.siret = req.body.siret,
              existingCoach.iban = req.body.iban,
              existingCoach.bic = req.body.bic,
              existingCoach.price = req.body.price,
              existingCoach. notes = req.body.notes,
              existingCoach.agenda = req.body.agenda,
  
              existingCoach.save()
                .then(updatedDoc => {
                  res.json({ result: true, coach: updatedDoc });
                })
                .catch(error => {
                  res.status(500).json({ error: 'Failed to update coach data' });
                });
            }
          })
          .catch(error => {
            res.status(500).json({ error: 'Failed to find coach by user ID' });
          });
      })
      .catch(error => {
        res.status(500).json({ error: 'Failed to find coach by token' });
      });
  });




/* GET coach listing. */
router.get('/', (req, res) => {
  Coach.find() 
    .populate('Id_user', 'Id_planning') // Utilisez le nom du champ pour faire apparaitre la clé étrangère
    .then(data => {
        res.json({ result: true, data });
      })
      .catch(error => {
        res.status(500).json({ error: 'Failed to fetch coachs' });
      });
  });


/* DELETE user et son coach lié. Vérification avec présence du token */
router.delete('/:token', async (req, res) => {
    try {
      // d'abord recherche du coach par token
      const user = await User.findOne({ token: req.params.token });
      if (!user) {
        return res.json({ result: false, error: 'Coach not found' });
      }
  
      // étape 1 : Recherche du coach lié à cet utilisateur
      const coach = await Coach.findOne({ Id_user: user._id });
      if (coach) {
        // Suppression du student
        await Coach.deleteOne({ _id: coach._id });
      }
  
      // étape 2 : Suppression du user associé
      await User.deleteOne({ _id: user._id });
      
      return res.json({ result: true });
    } catch (error) {
      res.status(500).json({ result: false, error: 'Failed to delete user and associated coach' });
    }
  });

  //Le mot-clé try est utilisé pour entourer le bloc de code où vous voulez essayer d'exécuter une ou plusieurs opérations potentiellement risquées (telles que l'accès à la base de données, la lecture de fichiers, etc.).
//Si une exception (erreur) est levée dans le bloc try lors de l'exécution des opérations, le flux de contrôle est transféré au bloc catch, sautant ainsi les autres instructions dans le bloc try.
//Le bloc catch est utilisé pour gérer l'exception et effectuer des actions de récupération appropriées. Il permet d'exécuter un autre bloc de code spécifique pour gérer l'erreur sans interrompre l'exécution du programme.
//Vous pouvez accéder à l'erreur dans le bloc catch en utilisant un paramètre (souvent nommé error ou err), qui contiendra l'objet d'erreur avec des informations sur ce qui a mal tourné.

module.exports = router;

