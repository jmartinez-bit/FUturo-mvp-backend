const express = require('express');
const ContractSolicitudeService = require('../services/contractSolicitude.service');
const ContractService = require('../services/contract.service');
const SalaryBandService = require('../services/salaryBand.service');



const router = express.Router();
const contractService = new ContractService();
const contractSolicitudeService = new ContractSolicitudeService();
const salaryBandService = new SalaryBandService();



router.post("/newSolicitude",async (req, res,next) =>{
  try{
    //obligatorios
    const {tipo_documento, nro_documento, nombre, ape_paterno, ape_materno, fecha_nacimiento,
       nro_celular, correo, direccion, distrito,provincia, cod_cliente, cod_linea_negocio, cod_puesto, nivel,
        modalidad, remuneracion,fecha_inicio, fecha_fin}=req.body;
    //no obligatorios
      const bono_men=req.body.bono_men||null;
      const cod_eps=req.body.cod_eps||null;
      const eps_parcial_total=req.body.eps_parcial_total||null;
      const ind_sctr=req.body.ind_sctr||null;
      const condicional_adicional=req.body.condicional_adicional||null;

    //se verifica si existe un contrato vigente
    const codBanda=await salaryBandService.findSalaryBand(nivel,cod_puesto);
    const existAContract=  await contractService.isThereAContractActive(nro_documento);
    const existASolicitude= await contractSolicitudeService.isThereAPreviousSolicitude(nro_documento);
    if (existAContract.length===0){
      if(existASolicitude.length===0){
        if(codBanda.length!=0){
          await contractSolicitudeService.createSolicitude(tipo_documento, nro_documento, nombre, ape_paterno,
            ape_materno, fecha_nacimiento, nro_celular, correo, direccion, distrito, provincia, cod_cliente, cod_linea_negocio, cod_puesto,
             nivel, modalidad, remuneracion, bono_men,cod_eps,eps_parcial_total, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional);

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

router.post("/",async (req, res,next) =>{
  try{
    const body=req.body;
    const data=await contractSolicitudeService.findBy(body);
    res.json(data);
  }catch (e){
    next(e);
  }

});

router.get("/:cod",async (req, res,next) =>{
  try{
    const {cod}=req.params;
    const estado=await contractSolicitudeService.findState(cod);
    if(estado==="Aprobado"||estado==="Rechazado"){
      res.status(409).json({"error":false,
                          "message":"A esta solicitud ya se le asigno el estado "+estado});
    }else{
      const [data]=await contractSolicitudeService.findOne(cod);
      res.json(data);
    }
  }catch (e){
    next(e);
  }

});

router.get("/approve/:cod",async (req, res,next) =>{
  try{
    const {cod}=req.params;
    const estado=await contractSolicitudeService.findState(cod);
    if(estado==="Aprobado"||estado==="Rechazado"){
      res.status(409).json({"error":false,
      "message":"A esta solicitud ya se le asigno el estado "+estado});
    }else{
      await contractSolicitudeService.approve(cod);
      res.status(200).json({"error":false,
                          "message":"Se cambió el estado a Aprobado y se creo un nuevo contrato"});
    }

  }catch (e){
    next(e);
  }

});

router.get("/reject/:cod",async (req, res,next) =>{
  try{
    const {cod}=req.params;
    const estado=await contractSolicitudeService.findState(cod);
    if(estado==="Aprobado"||estado==="Rechazado"){
      res.status(409).json({"error":false,
      "message":"A esta solicitud ya se le asigno el estado "+estado});
    }else{
      await contractSolicitudeService.reject(cod);
      res.status(200).json({"error":false,
                          "message":"Se cambió el estado a Rechazado"});
    }

  }catch (e){
    next(e);
  }

});

module.exports = router;
