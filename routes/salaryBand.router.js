const express = require('express');
const SalaryBandService = require('../services/salaryBand.service');

const router = express.Router();
const salaryBandService = new SalaryBandService();

router.get("/:cod_puesto/:nivel",async (req, res,next) =>{
  try{
    const {cod_puesto,nivel}=req.params;
    const resources=await salaryBandService.findSalaryBand(nivel,cod_puesto);
    res.json(resources);

  }catch (e){
    next(e);
  }

});
