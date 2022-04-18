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
       nro_celular, correo, direccion, distrito, cod_cliente, cod_linea_negocio, cod_puesto, nivel,
       cod_banda_salarial, modalidad, remuneracion,fecha_inicio, fecha_fin}=req.body;
    //no obligatorios
      const bono_men=req.body.bono_men||null;
      const ind_eps=req.body.ind_eps||null;
      const monto_eps=req.body.ind_eps||null;
      const ind_sctr=req.body.ind_sctr||null;
      const condicional_adicional=req.body.condicional_adicional||null;
    //calculo del clm
    const asig_familiar=0;
    var clm=(remuneracion+asig_familiar)*1.47+monto_eps;
    if(ind_sctr){
      clm+=remuneracion*0.14;
    }
    //verificar si el clm está dentro de la banda salarial
    const maximo=await salaryBandService.findMax(cod_banda_salarial);
    if(clm<=maximo){
      var estado="Pendiente Aprobación";
    }else{
      estado="Pendiente Aprobación GG";
    }
    //se verifica si existe un contrato vigente
    const existAContract=  await contractService.isThereAContractActive(nro_documento)
    if (existAContract.length===0){

    await contractSolicitudeService.createSolicitude(tipo_documento, nro_documento, nombre, ape_paterno,
       ape_materno, fecha_nacimiento, nro_celular, correo, direccion, distrito, cod_cliente, cod_linea_negocio, cod_puesto,
        nivel, modalidad, remuneracion, bono_men,ind_eps, monto_eps, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional,clm,estado);

    res.status(201).json("Nueva solicitud de contratación creada");
    }else{
    res.status(409).json("Existe un contrato vigente con este número de documento");
    }


  }catch (e){
    next(e);
  }

});

module.exports = router;
