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

router.post("/createOrEditAssignment",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin,codColab,codServ,percent,codAsignacion,horasAsignadas,tarifa}=req.body;
    var rta=await assignmentsService.validateDates(fechaIni, fechaFin, codColab,codServ);
    var e=rta.error;
    if(!(await assignmentsService.validatePercentage(fechaIni, fechaFin, codColab,percent)) && !e){
    rta={"error":true,"message":"El porcentaje de asignación excede el 100% en algun punto del periodo seleccionado"};
    e=true;
    }
    const prodPlanificada=horasAsignadas*tarifa;
    if(!(await assignmentsService.validatesumPlannedProductions(codServ, codAsignacion,prodPlanificada)) && !e){
      rta={"error":true,"message":"La suma de las producciones planificadas del equipo asignado es mayor al valor de la venta en soles"};
      e=true;
    }
    if(!e ){
        const {authorization}=req.headers;
        const auth=JSON.parse(authorization);
        const codUsuario=auth.id_sesion;
      if(codAsignacion===null){
        rta=await assignmentsService.createAssingment(req.body,prodPlanificada,codUsuario);
      }else{
       ;
      }

    }
    res.json(rta);
  }catch (e){
    next(e);
  }

});

module.exports = router;
