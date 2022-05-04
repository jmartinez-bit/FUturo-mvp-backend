const express = require('express');
const {upload} = require('./../middlewares/upload.handler');
const multer=require('multer');


const router = express.Router();


router.post("/",function (req, res) {
  console.log(req.headers);
  upload.single("myFile")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.send({ error: true,message:err.message });
    } else if (err) {
      res.send({ error: true,message:"Hubo un error en la subida del archivo" });
    }else{
    res.send({ error: false,message:"El archivo se subió al servidor con éxito",filename: `${req.file.filename}` });
    }
  })
});

module.exports = router;
