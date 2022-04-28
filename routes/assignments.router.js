const express = require('express');
const AssignmentsService = require('../services/assignments.service');


const router = express.Router();
const assignmentsService = new AssignmentsService();


router.get("/:fechaIni/:fechaFin/:codColab",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin,codColab}=req.params;
    const max=await assignmentsService.maxAccumulatedAssignedPercentageInAnInterval(fechaIni,fechaFin,codColab);
    res.json({"maximo_porcentaje_acumulado":max});

  }catch (e){
    next(e);
  }

});


module.exports = router;
