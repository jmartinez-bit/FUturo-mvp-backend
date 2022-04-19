const express = require('express');
const SalaryBandService = require('../services/salaryBand.service');

const router = express.Router();
const salaryBandService = new SalaryBandService();

router.get("/:cod_puesto/:nivel",async (req, res,next) =>{
  try{
    const {cod_puesto,nivel}=req.params;
    const data=await salaryBandService.findSalaryBand(nivel,cod_puesto);
    res.json(data);

  }catch (e){
    next(e);
  }

});

module.exports = router;
