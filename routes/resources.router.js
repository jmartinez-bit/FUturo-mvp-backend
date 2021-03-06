const express = require('express');
const AssignmentsService = require('../services/assignments.service');
const CollaboratorService = require('../services/collaborator.service');
const ResourcesService = require('./../services/resources.service');

const router = express.Router();
const service = new ResourcesService();
const collaboratorService = new CollaboratorService();
const assignmentsService = new AssignmentsService();

/**
 * @swagger
 * components:
 *  schemas:
 *    Unauthorized:
 *      type: object
 *      properties:
 *        statusCode:
 *          type: integer
 *          description: estado de la respuesta
 *        error:
 *          type: string
 *          description: error
 *        message:
 *          type: string
 *          description: mensaje de error
 *    ParamsGetResourcesMap:
 *      type: object
 *      properties:
 *        cod_cliente:
 *          type: integer
 *          description: Código del cliente
 *        periodo:
 *          type: string
 *          description: Periodo mensual actual (mm-yyyy)
 *      required:
 *        - cod_cliente
 *        - periodo
 *      example:
 *        cod_cliente: 1
 *        periodo: 11-2022
 *    GetResourcesMap:
 *      type: object
 *      properties:
 *        cod_mapa_recurso:
 *          type: integer
 *          description: Código del mapa de recurso
 *        cod_colaborador:
 *          type: integer
 *          description: Código del colaborador
 *        linea_negocio:
 *          type: string
 *          description: Línea del negocio
 *        estado:
 *          type: string
 *          description: Estado del colaborador
 *        nombre_perfil:
 *          type: string
 *          description: Nombre del perfil
 *        nivel:
 *          type: string
 *          description: Nivel del colaborador
 *        fecha_inicio:
 *          type: string
 *          description: Fecha de Inicio
 *        fecha_fin:
 *          type: string
 *          description: Fecha de Fin
 *        asignacion:
 *          type: integer
 *          description: Porcentaje de asignación
 *        fecha_fin_contrato:
 *          type: integer
 *          description: Fecha de fin de contrato
 *        clm_efectivo:
 *          type: string
 *          description: CLM Efectivo
 *        produccion:
 *          type: string
 *          description: Producción
 *        productividad:
 *          type: string
 *          description: Productividad
 *        nombre_colaborador:
 *          type: string
 *          description: Nombre del colaborador
 *      example:
 *        cod_mapa_recurso: 670
 *        cod_colaborador: 418
 *        linea_negocio: "ATIS"
 *        estado: "A"
 *        nombre_perfil: "ANALISTA PROGRAMADOR"
 *        nivel: "junior"
 *        fecha_inicio: "2022-05-20"
 *        fecha_fin: "2022-07-14"
 *        asignacion: 100
 *        fecha_fin_contrato: "2022-12-31"
 *        clm_efectivo: "1386.00"
 *        produccion: "2536.00"
 *        productividad: "1.82"
 *        nombre_colaborador: "Franccesco Jaimes Agreda"
 *    GetPeriods:
 *      type: object
 *      properties:
 *        periodo:
 *          type: string
 *          description: periodo mensual actual (mm-yyyy)
 *        estado:
 *          type: string
 *          description: estado del periodo
 *      required:
 *        - periodo
 *        - estado
 *      example:
 *        periodo: 04-2022
 *        estado: A
 *    GetClientsByDM:
 *      type: object
 *      properties:
 *        cod_cliente:
 *          type: integer
 *          description: Código de cliente
 *        nombre_corto:
 *          type: string
 *          description: Nombre corto del Cliente
 *      required:
 *        - cod_cliente
 *        - nombre_corto
 *      example:
 *        cod_cliente: 1
 *        nombre_corto: "Antamina"
 *    GetProfiles:
 *      type: object
 *      properties:
 *        cod_perfil:
 *          type: integer
 *          description: Código del perfil
 *        nombre_perfil:
 *          type: string
 *          description: Nombre del perfil
 *      required:
 *        - cod_perfil
 *        - nombre_perfil
 *      example:
 *        cod_perfil: 62
 *        nombre_perfil: "UX ENGINEER"
 *    MontoServicio:
 *      type: object
 *      properties:
 *        clm_efectivo:
 *          type: string
 *          description: CLM Efectivo
 *        produccion:
 *          type: string
 *          description: Producción
 *        productividad:
 *          type: string
 *          description: Productividad
 *      required:
 *        - clm_efectivo
 *        - produccion
 *        - productividad
 *      example:
 *        clm_efectivo: "9816.00"
 *        produccion: "16173.00" 
 *        productividad: "1.6476161369193154" 
 */


// Buscar recursos de un Delivery Manager
/**
 * @swagger
 * /api/v1/resources/resourcesmap:
 *  post:
 *    summary: Obtener recursos de un DM
 *    tags: [ResourcesMap]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ParamsGetResourcesMap'
 *            
 *    responses:
 *      200:
 *        description: Lista de recursos de un DM
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/GetResourcesMap'
 *      401:
 *        description: Acceso no autorizado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Unauthorized'
 */


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

// Retornar todos los periodos
/**
 * @swagger
 * /api/v1/resources/periods:
 *  get:
 *    summary: Obtener todos los periodos
 *    tags: [ResourcesMap]
 *            
 *    responses:
 *      200:
 *        description: Lista de periodos
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/GetPeriods'
 *      401:
 *        description: Acceso no autorizado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Unauthorized'
 */


//Retorna todos los periodos
router.get("/periods",async (_req, res,next) =>{
  try{
    const periods=await service.findPeriods();
    res.json(periods);
  }catch (e){
    next(e);
  }

});

/**
 * @swagger
 * /api/v1/resources/{idDM}/clients:
 *  get:
 *    summary: Obtener todos los clientes de un DM
 *    tags: [ResourcesMap]
 *    parameters:
 *      - in: path
 *        name: idDM
 *        schema:
 *          type: string
 *        required: true
 *        description: ID del DM
 *    responses:
 *      200:
 *        description: Lista de clientes de un DM
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/GetClientsByDM'
 *      401:
 *        description: Acceso no autorizado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Unauthorized'
 */

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

/**
 * @swagger
 * /api/v1/resources/profiles:
 *  get:
 *    summary: Obtener todos los perfiles
 *    tags: [ResourcesMap]
 *    responses:
 *      200:
 *        description: Lista de perfiles
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/GetProfiles'
 *      401:
 *        description: Acceso no autorizado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Unauthorized'
 */

//Retorna todos los perfiles
router.get("/profiles",async (_req, res,next) =>{
  try{
    const profiles=await service.findProfiles();
    res.json(profiles);
  }catch (e){
    next(e);
  }

});

/**
 * @swagger
 * /api/v1/resources/montoservicio:
 *  post:
 *    summary: Obtener todos los perfiles
 *    tags: [ResourcesMap]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ParamsGetResourcesMap'
 *    responses:
 *      200:
 *        description: Monto del servicio
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/MontoServicio'
 *      401:
 *        description: Acceso no autorizado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Unauthorized'
 */

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
