var express = require('express');
var router = express.Router();
const uniqid = require('uniqid');

const cloudinary = require('cloudinary').v2;
const fs = require('fs');


router.post('/upload', async (req, res) => {
  try {
    const photoStream = req.files.photoFromFront.data;

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


module.exports = router;
