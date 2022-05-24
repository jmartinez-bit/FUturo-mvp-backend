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
    const contrato_vencer=req.body.contrato_vencer||null;

    const resources=await service.findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,nombres,contrato_vencer);
    res.json(resources);

  }catch (e){
    next(e);
  }

});

//Retorna todos los periodos
router.get("/periods",async (_req, res,next) =>{
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
router.get("/profiles",async (_req, res,next) =>{
  try{
    const profiles=await service.findProfiles();
    res.json(profiles);
  }catch (e){
    next(e);
  }

});

//Calculo del monto de servicio por periodo y cliente.
router.post("/montoservicio",async (req, res,next) =>{
  try{
    const cod_cliente=req.body.cod_cliente;
    const periodo=req.body.periodo;
    const perfil=req.body.perfil||null;
    const nombre=req.body.nombre||null;
    const resources=await service.findByMontoServicio(cod_cliente,periodo,perfil,nombre);
    res.json(resources);
  }catch (e){
    next(e);
  }
});

//Proceso de apertura mensual de mapa de recursos.
router.get("/aperturamaparecursos",async (_req, res,next) =>{
  try{
    const resources=await service.findByAperturaMapaRecursosMensual();
    res.json(resources);
  }catch (e){
    next(e);
  }
});

// Obtener productividad del colaborador por codigo del mapa de recurso
router.get('/productividad/:resmapid', async (req, res, next) => {
  try {
    const { resmapid } = req.params;
    const resource = await service.findByResourceMapID(resmapid);
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

// Obtener contrato por codigo del colaborador y periodo
router.get('/contrato/:cod_colaborador/:periodo', async (req, res, next) => {
  try {
    const { cod_colaborador, periodo } = req.params;
    const contract = await collaboratorService.findByCodColaboradorJoinContrato(cod_colaborador);
    res.json(contract);
  } catch (error) {
    next(error);
  }
});

// Obtener servicios asignados por codigo del colaborador, periodo y codigo del cliente
router.get('/asignaciones/:cod_colaborador/:periodo/:cod_cliente', async (req, res, next) => {
  try {
    const { cod_colaborador, periodo, cod_cliente } = req.params;
    const assignments = await assignmentsService.findByCodColaboradorJoinServicio(cod_colaborador, periodo, cod_cliente);
    res.json(assignments);
  } catch (error) {
    next(error);
  }
});

//Retorna todos los nombres y códigos de los colaboradores de un cliente en un periodo dado
router.get("/:id_client/collaborators/:period",async (req, res,next) =>{
  try{
    const {id_client,period}=req.params;
    const profiles=await service.findCollaboratorNames(id_client,period);
    res.json(profiles);
  }catch (e){
    next(e);
  }
});

//Retorna datos de los colaboradores activos de un cliente en un periodo dado
router.post("/:id_client/collaboratorsActives",async (req, res,next) =>{
  try{
    const {id_client}=req.params;
    const name=req.body.nombres||null;
    const nroDoc=req.body.nro_documento||null;
    const profiles=await service.findCollaboratorsByClientPeriodAndState(id_client,'A',name,nroDoc);
    res.json(profiles);
  }catch (e){
    next(e);
  }
});



module.exports = router;
