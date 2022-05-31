const express = require('express');
const ContractSolicitudeService = require('../services/contractSolicitude.service');
const ContractService = require('../services/contract.service');
const SalaryBandService = require('../services/salaryBand.service');




const router = express.Router();
const contractService = new ContractService();
const contractSolicitudeService = new ContractSolicitudeService();
const salaryBandService = new SalaryBandService();

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
 *    ParamsNewSolicitude:
 *      type: object
 *      properties:
 *        nro_documento:
 *          type: string
 *          description: Número de documento
 *        cod_puesto:
 *          type: integer
 *          description: codigo del puesto
 *        nivel:
 *          type: string
 *          description: nivel del colaborador
 *      required:
 *        - nro_documento
 *        - cod_puesto
 *        - nivel
 *      example:
 *        nro_documento: "77215670"
 *        cod_puesto: 1
 *        nivel: "junior"
 *    ParamsReject:
 *      type: object
 *      properties:
 *        motivo_rechazo:
 *          type: string
 *          description: motivo del rechazo
 *      required:
 *        - motivo_rechazo
 *      example:
 *        motivo_rechazo: "Por no saber Angular"
 */


/**
 * @swagger
 * /api/v1/contractSolicitude/newSolicitude:
 *  post:
 *    summary: Crear una nueva solicitud
 *    tags: [ContractSolicitude]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ParamsNewSolicitude'
 *    responses:
 *      201:
 *        description: Nueva solicitud de contratación creada
 *      401:
 *        description: Acceso no autorizado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Unauthorized'
 *      409:
 *        description: No existe banda salarial para este nivel y puesto o Existe una solicitud pendiente con este número de documento o Existe un contrato vigente con este número de documento
 */

router.post("/newSolicitude",async (req, res,next) =>{
  try{
    //obligatorios
    const { nro_documento, cod_puesto, nivel}=req.body;

    //se verifica si existe un contrato vigente
    const [data]=await salaryBandService.findSalaryBand(nivel,cod_puesto);
    const codBanda=data.cod_banda_salarial;
    const existAContract=  await contractService.isThereAContractActive(nro_documento);
    const existASolicitude= await contractSolicitudeService.isThereAPreviousSolicitude(nro_documento);
    if (existAContract.length===0){
      if(existASolicitude.length===0){
        if(codBanda.length!=0){
          await contractSolicitudeService.createSolicitude(req.body,codBanda);

           res.status(201).json({"error":false,
                               "message":"Nueva solicitud de contratación creada"});
        }
      else{
        res.status(409).json({"error":false,
        "message":"No existe banda salarial para este nivel y puesto"});
      }
      }
      else{
      res.status(409).json({"error":true,
                          "message":"Existe una solicitud pendiente con este número de documento"});
      }
    }else{
    res.status(409).json({"error":true,
                        "message":"Existe un contrato vigente con este número de documento"});
    }

  }catch (e){
    next(e);
  }

});
// !CREO QUE YA NO VA
// /**
//  * @swagger
//  * /api/v1/contractSolicitude/{cod_sol_contratacion}:
//  *  get:
//  *    summary: Buscar una solicitud de contratación
//  *    tags: [ContractSolicitude]
//  *    parameters:
//  *      - in: path
//  *        name: cod_sol_contratacion
//  *        schema:
//  *          type: string
//  *        required: true
//  *        description: Código de solicitud de contratación
//  *    responses:
//  *      200:
//  *        description: Se encontró la solicitud de contratación
//  */

// router.get("/:cod",async (req, res,next) =>{
//   try{
//     const {cod}=req.params;
//     const [data]=await contractSolicitudeService.findOne(cod);
//     res.json(data);

//   }catch (e){
//     next(e);
//   }

// });

/**
 * @swagger
 * /api/v1/contractSolicitude/approve/{cod_sol_contratacion}/{asignacion_familiar}:
 *  get:
 *    summary: Aprobar una solicitud de contratación
 *    tags: [ContractSolicitude]
 *    parameters:
 *      - in: path
 *        name: cod_sol_contratacion
 *        schema:
 *          type: string
 *        required: true
 *        description: Código de solicitud de contratación
 *      - in: path
 *        name: asignacion_familiar
 *        schema:
 *          type: string
 *        required: true
 *        description: Asignación familiar
 *    responses:
 *      200:
 *        description: Se cambió el estado a Aprobado y se creo un nuevo contrato
 *      409:
 *        description: A esta solicitud ya se le asignó el estado o Necesita aprobación del Gerente General
 */

router.get("/approve/:cod/:indAsignFamiliar",async (req, res,next) =>{
  try{
    const cod_usuario = req.user.id_sesion;
    const {cod,indAsignFamiliar}=req.params;
    const estado=await contractSolicitudeService.findState(cod);
    if(estado==="Aprobado"||estado==="Rechazado"){
      res.status(409).json({"error":false,
      "message":"A esta solicitud ya se le asigno el estado "+estado});
    }else if(estado==="Pendiente Aprobacion GG"){
      res.status(409).json({"error":false,
      "message":"Necesita aprobación del Gerente General "});
    }else{
      await contractSolicitudeService.approve(cod,indAsignFamiliar,cod_usuario);
      res.status(200).json({"error":false,
                          "message":"Se cambió el estado a Aprobado y se creo un nuevo contrato"});
    }

  }catch (e){
    next(e);
  }

});

/**
 * @swagger
 * /api/v1/contractSolicitude/reject/{cod_sol_contratacion}:
 *  post:
 *    summary: Rechazar una solicitud de contratación
 *    tags: [ContractSolicitude]
 *    parameters:
 *      - in: path
 *        name: cod_sol_contratacion
 *        schema:
 *          type: string
 *        required: true
 *        description: Código de solicitud de contratación
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/ParamsReject'
 *    responses:
 *      200:
 *        description: Se cambió el estado a Rechazado
 *      409:
 *        description: A esta solicitud ya se le asignó un estado
 */

router.post("/reject/:cod",async (req, res,next) =>{
  try{
    const {cod}=req.params;
    const estado=await contractSolicitudeService.findState(cod);
    if(estado==="Aprobado"||estado==="Rechazado"){
      res.status(409).json({"error":false,
      "message":"A esta solicitud ya se le asigno el estado "+estado});
    }else{
      await contractSolicitudeService.reject(cod,req.body);
      res.status(200).json({"error":false,
                          "message":"Se cambió el estado a Rechazado"});
    }

  }catch (e){
    next(e);
  }

});

/**
 * @swagger
 * /api/v1/contractSolicitude/approvegg/{cod_sol_contratacion}:
 *  post:
 *    summary: Aprobación de solicitud de contratación que se debe realizar por el Gerente General
 *    tags: [ContractSolicitude]
 *    parameters:
 *      - in: path
 *        name: cod_sol_contratacion
 *        schema:
 *          type: string
 *        required: true
 *        description: Código de solicitud de contratación
 *    responses:
 *      200:
 *        description: Se aceptó la solicitud de contratación
 *      409:
 *        description: A esta solicitud ya se le asignó un estado
 */


router.get("/approvegg/:cod",async (req, res,next) =>{
  try{
    const {cod}=req.params;
    const estado=await contractSolicitudeService.findState(cod);
    if(estado==="Aprobado"||estado==="Rechazado"){
      res.status(409).json({"error":false,
      "message":"A esta solicitud ya se le asigno el estado "+estado});
    }else{
      await contractSolicitudeService.approvegg(cod);
      res.status(200).json({"error":false,
                          "message":"Se cambió el estado a Pendiente Aprobacion"});
    }

  }catch (e){
    next(e);
  }

});

/**
 * @swagger
 * /api/v1/contractSolicitude/edit/{cod_sol_contratacion}:
 *  post:
 *    summary: Editar una solicitud de contratación
 *    tags: [ContractSolicitude]
 *    parameters:
 *      - in: path
 *        name: cod_sol_contratacion
 *        schema:
 *          type: string
 *        required: true
 *        description: Código de solicitud de contratación
 *    responses:
 *      200:
 *        description: Se cambió el estado a Rechazado
 *      409:
 *        description: A esta solicitud ya se le asignó un estado
 */

router.post("/edit/:cod",async (req, res,next) =>{
  try{
    const {cod}=req.params;
    const data=await contractSolicitudeService.editSolicitude(cod,req.body);
    res.json(data);

  }catch (e){
    next(e);
  }

});

module.exports = router;
