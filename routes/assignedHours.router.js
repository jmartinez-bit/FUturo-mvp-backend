const express = require('express');
const AssignedHoursService = require('../services/assignedHours.service');


const router = express.Router();
const assignedHoursService = new AssignedHoursService();


router.get("/:fechaIni/:fechaFin",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin}=req.params;
    const assignedHours=await assignedHoursService.findAssignedHoursTotalAssignment(fechaIni,fechaFin);
    res.json({"horas_asignadas_asignacion_total":assignedHours});

  }catch (e){
    next(e);
  }

});


module.exports = router;
