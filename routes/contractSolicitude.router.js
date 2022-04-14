const express = require('express');
const ContractSolicitudeService = require('../services/contractSolicitude.service');

const router = express.Router();
const contractSolicitudeService = new ContractSolicitudeService();

router.post("/newSolicitude",async (req, res,next) =>{
  try{
    //obligatorios
    const {tipo_documento, nro_documento, nombre, ape_paterno, ape_materno, fecha_nacimiento,
       nro_celular, correo, direccion, distrito, cod_cliente, cod_linea_negocio, cod_puesto, nivel,
       banda_salarial, modalidad, remuneracion,fecha_inicio, fecha_fin}=req.body;
    //no obligatorios
      const bono_men=req.body.bono_men||null;
      const ind_eps=req.body.ind_eps||null;
      const ind_sctr=req.body.ind_sctr||null;
      const condicional_adicional=req.body.condicional_adicional||null;

    await contractSolicitudeService.createSolicitude(tipo_documento, nro_documento, nombre, ape_paterno,
       ape_materno, fecha_nacimiento, nro_celular, correo, direccion, distrito, cod_cliente, cod_linea_negocio, cod_puesto,
        nivel,banda_salarial, modalidad, remuneracion, bono_men, ind_eps, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional);

    res.status(201).json("nueva solicitud creada");

  }catch (e){
    next(e);
  }

});

module.exports = router;
