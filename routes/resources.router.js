const express = require('express');
const AssignmentsService = require('../services/assignments.service');
const CollaboratorService = require('../services/collaborator.service');
const ResourcesService = require('./../services/resources.service');

const router = express.Router();
const service = new ResourcesService();
const collaboratorService = new CollaboratorService();
const assignmentsService = new AssignmentsService();

//Buscar recursos de un Delivery Manager
router.post("/resourcesmap",async (req, res,next) =>{
  try{
    const {cod_cliente,periodo}=req.body;
    const cod_perfil=req.body.cod_perfil||null;
    const nombres=req.body.nombres||null;

    const resources=await service.findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,nombres);
    res.json(resources);

  }catch (e){
    next(e);
  }

});

//Retorna todos los periodos
router.get("/periods",async (req, res,next) =>{
  try{
    const periods=await service.findPeriods();
    res.json(periods);
  }catch (e){
    next(e);
  }

});

//Retorna todos los clientes de un Delivery Manager
router.get("/:idDM/clients",async (req, res,next) =>{
  try{
    const {idDM}=req.params;
    const clients=await service.findClients(idDM);
    res.json(clients);
  }catch (e){
    next(e);
  }


});

//Retorna todos los perfiles
router.get("/profiles",async (req, res,next) =>{
  try{
    const profiles=await service.findProfiles();
    res.json(profiles);
    const cod_cliente=req.body.cod_cliente;
    const periodo=req.body.periodo;
    const perfil=req.body.perfil||null;
    const cod_colaborador=req.body.cod_colaborador||null;

    const resources=await service.findByMontoServicio(cod_cliente,periodo,perfil,cod_colaborador);
    res.json(resources);
  }catch (e){
    next(e);
  }

});

//Calculo del monto de servicio por periodo y cliente.
router.get("/montoservicio",async (req, res,next) =>{
  try{
    const cod_cliente=req.body.cod_cliente;
    const periodo=req.body.periodo;
    const perfil=req.body.perfil||null;
    const cod_colaborador=req.body.cod_colaborador||null;
    const resources=await service.findByMontoServicio(cod_cliente,periodo,perfil,cod_colaborador);
    res.json(resources);
  }catch (e){
    next(e);
  }
});

//Proceso de apertura mensual de mapa de recursos.
router.get("/aperturamaparecursos",async (req, res,next) =>{
  try{
    const resources=await service.findByAperturaMapaRecursosMensual();
    res.json(resources);
  }catch (e){
    next(e);
  }
});

// router.get('/colaborador/:resmapid', async (req, res, next) => {
//   try {
//     const { resmapid } = req.params;
//     const colaborador = await service.findByResourceMapID(resmapid);
//     res.json(colaborador);
//   } catch (error) {
//     next(error);
//   }
// });

router.get('/productividad/:resmapid', async (req, res, next) => {
  try {
    const { resmapid } = req.params;
    const resource = await service.findByResourceMapID(resmapid);
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

router.get('/contrato/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const contract = await collaboratorService.findByCodColaboradorJoinContrato(id);
    res.json(contract);
  } catch (error) {
    next(error);
  }
});

router.get('/asignaciones/:id/:fecIni/:fecFin', async (req, res, next) => {
  try {
    const { id, fecIni, fecFin } = req.params;
    const assignments = await assignmentsService.findByCodColaboradorJoinServicio(id, fecIni, fecFin);
    res.json(assignments);
  } catch (error) {
    next(error);
  }
});

//Retorna todos los nombres de los colaboradores
router.get("/:id_client/collaborators/:period",async (req, res,next) =>{
  try{
    const {id_client,period}=req.params;
    const profiles=await service.findCollaboratorNames(id_client,period);
    res.json(profiles);
  }catch (e){
    next(e);
  }
});

// router.get('/:cliente/:periodo', async (req, res, next) => {
//   try {
//     const { cliente, periodo } = req.params;
//     const resources = await service.findByClientAndPeriod(cliente, periodo);
//     res.json(resources);
//   } catch (e) {
//     next(e);
//   }
// });


module.exports = router;
