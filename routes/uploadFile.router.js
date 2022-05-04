const express = require('express');
const {upload} = require('./../middlewares/upload.handler');


const router = express.Router();


router.post("/",upload.single("myFile"),async (req, res) =>{
  console.log(req.file.filename);
  res.send({ data: "OK",filename: `${req.file.filename}` });
  //res.send({ data: "OK" });
});

module.exports = router;
