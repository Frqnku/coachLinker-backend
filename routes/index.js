var express = require('express');
var router = express.Router();
const uniqid = require('uniqid');

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Book = require('../models/bookings')
const Student = require('../models/students');
const Coach = require('../models/coachs');
const { checkBody } = require('../modules/checkBody');
const bcrypt = require('bcrypt')

router.post('/connect', (req, res) => {
  console.log(req.body, 'connect')
  if (!checkBody(req.body, ['email', 'password'])) {
    return res.json({ result: false, error: 'Remplissez tous les champs de saisie' });
  }

  Coach.findOne({email: req.body.email})
  .then(data => {
    if(data && bcrypt.compareSync(req.body.password, data.password)) {
Book.find({coachID : data._id}).populate('studentID').then((books) => {
  return res.json({result: true, message: 'Connecté avec succès', token: data.token,isCoach: data.isCoach, isValidate: data.isValidate, name: data.name , firstname: data.firstname, books })
})
     

    }

    Student.findOne({email: req.body.email})
    .then(data => {
      if(data && bcrypt.compareSync(req.body.password, data.password)) {
        Book.find({studentID : data._id}).populate('coachID').then((books) => {
        return res.json({result: true, message: 'Connecté avec succès', token: data.token,isCoach: data.isCoach, name: data.name , firstname: data.firstname, books})
        })
      }

    
    })
  })
})

router.post('/isExisting', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    return res.json({ result: false, error: 'Remplissez tous les champs de saisie' });
  }

  Coach.findOne({email: req.body.email})
  .then(data => {
    if(data) {
      return res.json({result: false, error: 'Email déjà utilisé'})
    }

    Student.findOne({email: req.body.email})
    .then(data => {
      if(data) {
        return res.json({result: false, error: 'Email déjà utilisé'})
      }

      return res.json({result: true, message: 'Aucun utilisateur trouvé'})
    })
  })

})

router.post('/upload', async (req, res) => {
  console.log('files', req.files)
  try {
    const photoStream = req.files.photoFromFront.data;
    console.log('photostream' , photoStream)
    cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          res.json({ result: false, error: 'Error uploading to Cloudinary' });
        } else {
          console.log('Cloudinary response:', result);
          res.json({ result: true, url: result.secure_url });
        }
      }
    ).end(photoStream);
  } catch (error) {
    console.error('Error handling the upload:', error);
    res.json({ result: false, error: 'Error handling the upload' });
  }
});


router.post('/audio', async (req, res) => {
  console.log('fetched')
  console.log('backend received fetch', req.files.recordFromFront)

const recordPath = `./tmp/${uniqid()}.mp3`;
try {
  await req.files.recordFromFront.mv(recordPath);

  const resultCloudinary = await cloudinary.uploader.upload(recordPath, {
      resource_type: "auto",
  });
  console.log('Cloudinary response:', resultCloudinary);

  if (resultCloudinary) {
    fs.unlinkSync(recordPath);
    return res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    return res.json({ result: false, error: 'Failed' });
  }
} catch (error) {
  console.error('Error uploading file:', error);
  return res.json({ result: false, error: 'Failed to upload the file' });
}
});

module.exports = router;
