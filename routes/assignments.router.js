const express = require('express');
const sequelize = require('../libs/sequelize');
const AssignmentsService = require('../services/assignments.service');
const PeriodService = require('../services/period.service');
const ServicesService = require('../services/services.service');


const router = express.Router();
const assignmentsService = new AssignmentsService();
const periodService = new PeriodService();
const servicesService = new ServicesService();


router.get("/maxAccumPercent/:fechaIni/:fechaFin/:codColab",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin,codColab}=req.params;
    const max=await assignmentsService.maxAccumulatedAssignedPercentageInAnInterval(fechaIni,fechaFin,codColab,-1);
    res.json({"maximo_porcentaje_acumulado":max});

  }catch (e){
    next(e);
  }

});

router.post("/createOrEditAssignment",async (req, res,next) =>{
  try{
    const {fecha_ini,fecha_fin,cod_colaborador,cod_servicio,percent,horas_asignadas,tarifa}=req.body;
    const cod_asignacion=req.body.cod_asignacion||-1;
    var rta=await assignmentsService.validateDates(fecha_ini, fecha_fin, cod_colaborador,cod_servicio,cod_asignacion);
    var e=rta.error;
    if(!(await assignmentsService.validatePercentage(fecha_ini, fecha_fin, cod_colaborador,percent,cod_asignacion)) && !e){
    rta={"error":true,"message":"El porcentaje de asignación excede el 100% en algun punto del periodo seleccionado"};
    e=true;
    }
    const prodPlanificada=horas_asignadas*tarifa;
    if((await assignmentsService.validatesumPlannedProductions(cod_servicio, cod_asignacion,prodPlanificada)) && !e){
      rta={"error":true,"message":"La suma de las producciones planificadas del equipo asignado es mayor al valor de la venta en soles"};
      e=true;
    }
    if(!e ){
        const {authorization}=req.headers;
        const auth=JSON.parse(authorization);
        const codUsuario=auth.id_sesion;
      if(cod_asignacion===-1){
        await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN
        rta=await assignmentsService.createAssingment(req.body,prodPlanificada,codUsuario);
      }else{
        rta=await assignmentsService.editAssingment(req.body,prodPlanificada,codUsuario);
      }
    const codCliente=await servicesService.findClientCod(cod_servicio);
    const codLineaServicio=await servicesService.findServiceLineCod(cod_servicio);
    const data2=await periodService.getLastPeriod();
    const periodo=data2.periodo;
    await assignmentsService.updateStartDateOnResourcesMap(cod_colaborador,cod_servicio,codCliente,codLineaServicio,periodo);
    await assignmentsService.updateEndDateOnResourcesMap(cod_colaborador,cod_servicio,codCliente,codLineaServicio,periodo);
    await assignmentsService.updatePercentOnResourcesMap(cod_colaborador,cod_servicio,codCliente,codLineaServicio,periodo);
    }
    await sequelize.query(`COMMIT;`);//FIN DE LA TRANSACCIÓN
    res.json(rta);
  }catch (e){
    next(e);
  }

});

router.get("/validateDates/:fechaIni/:fechaFin/:codColab/:codServ",async (req, res,next) =>{
  try{
    const {fechaIni,fechaFin,codColab,codServ}=req.params;
    const rta=await assignmentsService.validateDates(fechaIni,fechaFin,codColab,codServ,-1);
    res.json(rta);

  }catch (e){
    next(e);
  }

});

router.get("/showgrid/:codServ",async (req, res,next) =>{
  try{
    const {codServ}=req.params;
    const rta=await assignmentsService.showAssignments(codServ);
    res.json(rta);

  }catch (e){
    next(e);
  }

});

router.get("/deleteAssignment/:codAsig",async (req, res,next) =>{
  try{
    const {codAsig}=req.params;
    const [cod_colaborador,cod_servicio]=await assignmentsService.findCollaboratorCodAndClientCod(codAsig);
    const rta=await assignmentsService.deleteAssignment(codAsig);
    const codCliente=await servicesService.findClientCod(cod_servicio);
    const codLineaServicio=await servicesService.findServiceLineCod(cod_servicio);
    const data2=await periodService.getLastPeriod();
    const periodo=data2.periodo;
    await assignmentsService.updateStartDateOnResourcesMap(cod_colaborador,cod_servicio,codCliente,codLineaServicio,periodo);
    await assignmentsService.updateEndDateOnResourcesMap(cod_colaborador,cod_servicio,codCliente,codLineaServicio,periodo);
    await assignmentsService.updatePercentOnResourcesMap(cod_colaborador,cod_servicio,codCliente,codLineaServicio,periodo);
    res.json(rta);

  }catch (e){
    next(e);
  }

});

module.exports = router;
