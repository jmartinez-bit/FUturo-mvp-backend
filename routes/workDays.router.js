const express = require('express');
const WorkDaysService = require('./../services/workDays.service');


const router = express.Router();
const workDaysService = new WorkDaysService();


router.get("/:fechaIni/:fechaFin/:porcAsign",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin,porcAsign}=req.params;
    const workHours=await workDaysService.findAsignedHours(fechaIni,fechaFin,porcAsign);
    res.json({"horas asignadas":workHours});

  }catch (e){
    next(e);
  }

});


module.exports = router;
