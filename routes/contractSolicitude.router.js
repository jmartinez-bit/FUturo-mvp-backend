const express = require('express');
const ContractSolicitudeService = require('../services/contractSolicitude.service');
const ContractService = require('../services/contract.service');


const router = express.Router();
const contractService = new ContractService();
const contractSolicitudeService = new ContractSolicitudeService();


router.post("/newSolicitude",async (req, res,next) =>{
  try{
    //obligatorios
    const {tipo_documento, nro_documento, nombre, ape_paterno, ape_materno, fecha_nacimiento,
       nro_celular, correo, direccion, distrito,provincia, cod_cliente, cod_linea_negocio, cod_puesto, nivel,
        modalidad, remuneracion,fecha_inicio, fecha_fin}=req.body;
    //no obligatorios
      const bono_men=req.body.bono_men||null;
      const cod_eps=req.body.cod_eps||null;
      const ind_sctr=req.body.ind_sctr||null;
      const condicional_adicional=req.body.condicional_adicional||null;

    //se verifica si existe un contrato vigente
    const existAContract=  await contractService.isThereAContractActive(nro_documento)
    if (existAContract.length===0){

    await contractSolicitudeService.createSolicitude(tipo_documento, nro_documento, nombre, ape_paterno,
       ape_materno, fecha_nacimiento, nro_celular, correo, direccion, distrito, provincia, cod_cliente, cod_linea_negocio, cod_puesto,
        nivel, modalidad, remuneracion, bono_men,cod_eps, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional);

    res.status(201).json("Nueva solicitud de contratación creada");
    }else{
    res.status(409).json("Existe un contrato vigente con este número de documento");
    }

  }catch (e){
    next(e);
  }

});

module.exports = router;
