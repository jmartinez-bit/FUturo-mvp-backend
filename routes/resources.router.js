const express = require('express');
const ResourcesService = require('./../services/resources.service');

const router = express.Router();
const service = new ResourcesService();

//Buscar recursos de un Delivery Manager
router.post("/maparecursos",async (req, res,next) =>{
  try{
    const cod_cliente=req.body.cod_cliente;
    const periodo=req.body.periodo;
    const cod_perfil=req.body.cod_perfil||null;
    const cod_colab=req.body.cod_colaborador||null;
    if(cod_perfil===null && cod_colab===null){
      const resources=await service.findByClientAndPeriod(cod_cliente,periodo);
      res.json(resources);
    }else if(cod_perfil===null && cod_colab!=null){
      const resources=await service.findByClientPeriodAndNames(cod_cliente,periodo,cod_colab);
      res.json(resources);
    }else if(cod_perfil!=null && cod_colab===null){
      const resources=await service.findByClientPeriodAndProfile(cod_cliente,periodo,cod_perfil);
      res.json(resources);
    }else if(cod_perfil!=null && cod_colab!=null){
      const resources=await service.findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,cod_colab);
      res.json(resources);
    }

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
    const {idDM}=req.params;
    const customers=await service.findCustomers(idDM);
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

router.get('/colaborador/:resmapid', async (req, res, next) => {
  try {
    const { resmapid } = req.params;
    const colaborador = await service.findOne(resmapid);
    res.json(colaborador);
  } catch (error) {
    next(error);
  }
});

//Retorna todos los nombres de los colaboradores
router.get("/:id_cliente/colaboradores",async (req, res,next) =>{
  try{
    const {id_cliente}=req.params;
    const profiles=await service.findCollaboratorNames(id_cliente);
    res.json(profiles);
  }catch (e){
    next(e);
  }
});

// router.get('/:cliente/:periodo', async (req, res, next) => {
//   try {
//     const { cliente, periodo } = req.params;
//     const resources = await service.findByClientAndPeriod(cliente, periodo);
//     res.json(resources);
//   } catch (e) {
//     next(e);
//   }
// });


module.exports = router;
