const express = require('express');
const SolicitudeService = require('../services/solicitude.service');

const router = express.Router();
const solicitudeService = new SolicitudeService();

router.post("/",async (req, res,next) =>{
  try{
    const body=req.body;
    const data=await solicitudeService.findBy(body);
    res.json(data);
  }catch (e){
    next(e);
  }

});

module.exports = router;
