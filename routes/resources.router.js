const express = require("express");
const ResourcesService =require("./../services/resources.service");

const router=express.Router();
const service=new ResourcesService();

router.get("/",async (req, res,next) =>{
  try{
    const resources=await service.findAll();
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


module.exports = router;
