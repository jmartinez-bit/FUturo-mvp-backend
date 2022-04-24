const express = require('express');
const EpsService = require('../services/eps.service');

const router = express.Router();
const epsService = new EpsService();

router.get("/",async (req, res,next) =>{
  try{
    const data=await epsService.findAll();
    res.json(data);

  }catch (e){
    next(e);
  }

});

module.exports = router;
