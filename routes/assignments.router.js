const express = require('express');
const AssignmentsService = require('../services/assignments.service');


const router = express.Router();
const assignmentsService = new AssignmentsService();


router.get("/maxAccumPercent/:fechaIni/:fechaFin/:codColab",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin,codColab}=req.params;
    const max=await assignmentsService.maxAccumulatedAssignedPercentageInAnInterval(fechaIni,fechaFin,codColab);
    res.json({"maximo_porcentaje_acumulado":max});

  }catch (e){
    next(e);
  }

});

router.get("/validateDates/:fechaIni/:fechaFin/:codColab/:codServ",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin,codColab,codServ}=req.params;
    const rta=await assignmentsService.validateDates(fechaIni,fechaFin,codColab,codServ);
      res.json(rta);
  }catch (e){
    next(e);
  }

});

module.exports = router;
