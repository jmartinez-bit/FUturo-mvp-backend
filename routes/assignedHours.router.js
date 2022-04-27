const express = require('express');
const AssignedHoursService = require('../services/assignedHours.service');


const router = express.Router();
const assignedHoursService = new AssignedHoursService();


router.get("/:fechaIni/:fechaFin/:porcAsign",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin,porcAsign}=req.params;
    const workHours=await assignedHoursService.findAssignedHours(fechaIni,fechaFin,porcAsign);
    res.json({"horas asignadas":workHours});

  }catch (e){
    next(e);
  }

});


module.exports = router;
