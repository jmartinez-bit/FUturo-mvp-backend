const express = require('express');
const AsignedHoursService = require('../services/asignedHours.service');


const router = express.Router();
const asignedHoursService = new AsignedHoursService();


router.get("/:fechaIni/:fechaFin/:porcAsign",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin,porcAsign}=req.params;
    const workHours=await asignedHoursService.findAsignedHours(fechaIni,fechaFin,porcAsign);
    res.json({"horas asignadas":workHours});

  }catch (e){
    next(e);
  }

});


module.exports = router;
