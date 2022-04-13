const express = require('express');
const BusinessLineService = require('../services/businessLine.service');

const router = express.Router();
const businessLineService = new BusinessLineService();

router.get("/",async (req, res,next) =>{
  try{
    const resources=await businessLineService.findBusinessLines();
    res.json(resources);

  }catch (e){
    next(e);
  }

});
