const express = require("express");
const ResourcesService =require("./../services/resources.service");

const router=express.Router();
const service=new ResourcesService();

//Buscar recursos de un Delivery Manager
router.post("/:idDM/maparecursos",async (req, res,next) =>{
  try{
    const {idDM}=req.params;
    const cliente=req.body.cliente;
    const periodo=req.body.periodo;
    //const perfil=req.body.perfil||null;
    //const nombresyapell=req.body.nombresyapell||null;
    const resources=await service.findByClientAndPeriod(cliente,periodo);
    res.json(resources);
  }catch (e){
    next(e);
  }

});

//Retorna todos los periodos
router.get("/periodos",async (req, res,next) =>{
  try{
    const periods=await service.findPeriods();
    res.json(periods);
  }catch (e){
    next(e);
  }

});

//Retorna todos los clientes de un Delivery Manager
router.get("/:idDM/clientes",async (req, res,next) =>{
  try{
    const customers=await service.findCustomers();
    res.json(customers);
  }catch (e){
    next(e);
  }

});

//Retorna todos los perfiles
router.get("/perfiles",async (req, res,next) =>{
  try{
    const profiles=await service.findProfiles();
    res.json(profiles);
  }catch (e){
    next(e);
  }

});



module.exports = router;
