const express = require('express');
const BusinessLineService = require('../services/businessLine.service');

const router = express.Router();
const businessLineService = new BusinessLineService();

router.get("/",async (_req, res,next) =>{
  try{
    const data=await businessLineService.findBusinessLines();
    res.json(data);

  }catch (e){
    next(e);
  }

});

module.exports = router;
