const express = require("express");
const ResourcesService =require("./../services/resources.service");

const router=express.Router();
const service=new ResourcesService();

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



module.exports = router;
