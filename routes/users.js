var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



// POST news users /signup.
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

// vérification si un utilisateur n'a pas déjà été enregistré
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null && EMAIL_REGEX.test(req.body.email)) {

//hachage du mot de passe
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        password: hash,
        token: uid2(32),
        isValidate: false,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {

// User already exists in database
      res.json({ result: false, error: 'User already exists or email is incorrect' });
    }
  });
});

/* POST signin. */

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
// verification si utilisateur déjà dans la BDD
  User.findOne({ email: req.body.email }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      console.log(data)
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});


/* GET users listing. vérification avec présence du token */
router.get('/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, isValidate: data.isValidate });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

/* GET users listing. liste de tous les users */
router.get('/', (req, res) => {
  User.find().then(data => {
          res.json({ result: true, data });
  })
});


/* DELETE users. vérification avec présence du token */
router.delete('/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      // L'utilisateur existe, nous allons le supprimer
      User.deleteOne({ _id: data._id })
      .then(() => {
        res.json({ result: true });
      })
      .catch(error => {
        res.status(500).json({ result: false, error: 'Failed to delete user' });
      });
  } else {
    res.json({ result: false, error: 'User not found' });
  }
})
.catch(error => {
  res.status(500).json({ result: false, error: 'Failed to find user' });
});
});


module.exports = router;
