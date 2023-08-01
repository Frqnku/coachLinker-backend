var express = require('express');
var router = express.Router();
const uniqid = require('uniqid');

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqId = uniqid();
router.post('/upload', async (req, res) => {
    
    
    const photoPath = `./tmp/${uniqId}.jpg`;
    const resultMove = await req.files.photoFromFront.mv(photoPath);
   const resultCloudinary = await cloudinary.uploader.upload(photoPath);
    
    if(!resultMove) {
    fs.unlinkSync(photoPath);
        res.json({ result: true, url: resultCloudinary.secure_url });     
    } else {
      res.json({ result: false, error: resultMove });
    }
   });

module.exports = router;
