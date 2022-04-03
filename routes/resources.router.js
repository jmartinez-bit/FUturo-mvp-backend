const express = require("express");
const ResourcesService =require("./../services/resources.service");

const router=express.Router();
const service=new ResourcesService();

//Buscar recursos de un Delivery Manager
router.post("/maparecursos",async (req, res,next) =>{
  try{
    const cod_cliente=req.body.cod_cliente;
    const periodo=req.body.periodo;
    const cod_perfil=req.body.cod_perfil||null;
    const cod_colab=req.body.cod_colaborador||null;

    const resources=await service.findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,cod_colab);
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
router.get("/:idDM/clientes/:periodo",async (req, res,next) =>{
  try{
    const {idDM,periodo}=req.params;
    const customers=await service.findCustomers(idDM,periodo);
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

//Retorna todos los nombres de los colaboradores
router.get("/:id_cliente/colaboradores/:periodo",async (req, res,next) =>{
  try{
    const {id_cliente,periodo}=req.params;
    const profiles=await service.findCollaboratorNames(id_cliente,periodo);
    res.json(profiles);
  }catch (e){
    next(e);
  }

});



module.exports = router;
