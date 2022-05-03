const express = require('express');
const ParameterService = require('../services/parameter.service');

const router = express.Router();
const parameterService = new ParameterService();

router.get("/:nombreParametro",async (req, res,next) =>{
  try{
    const {nombreParametro}=req.params;
    const data=await parameterService.findParameterValue(nombreParametro)
    res.json(data);

  }catch (e){
    next(e);
  }

});

module.exports = router;
