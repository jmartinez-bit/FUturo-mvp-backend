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
router.get("/aperturamaparecursos",async (req, res,next) =>{
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
    const contract = await collaboratorService.findByCodColaboradorJoinContrato(cod_colaborador, periodo);
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

//Guardar pagos de servicios.
router.post("/guardarpagosservicios",async (req, res,next) =>{
  try{
    const cod_servicio=req.body.cod_servicio;
    const nombre_hito=req.body.nombre_hito;
    const horas=req.body.horas||null;
    const monto=req.body.monto||null;
    const fecha_inicio=req.body.fecha_inicio||null;
    const fecha_fin=req.body.fecha_fin||null;
    const resources=await service.savePagoServicios(cod_servicio,nombre_hito,horas,monto,fecha_inicio,fecha_fin);
    res.json(resources);
  }catch (e){
    next(e);
  }
});


//Obtener los servicios de un DM.
router.post("/mapaservicios",async (req, res,next) =>{
  try{
    const cod_cliente=req.body.cod_cliente;
    const cod_linea_negocio=req.body.cod_linea_negocio||null;
    const estado=req.body.estado||null;
    const resources=await service.findByMapaServicio(cod_cliente,cod_linea_negocio,estado);
    res.json(resources);
  }catch (e){
    next(e);
  }
});

module.exports = router;
