const express = require('express');
const ServicesService = require('./../services/services.service');

const router = express.Router();
const service = new ServicesService();

router.post('/', async (req, res, next) => {
    try {
      const body = req.body;
      res.status(201).json(await service.create(body));
    } catch (error) {
      next(error);
    }
  }
);


//Obtener los servicios de un DM.
router.post("/get",async (req, res,next) =>{
  try{
    const cod_cliente=req.body.cod_cliente;
    const cod_linea_negocio=req.body.cod_linea_negocio||null;
    const estado=req.body.estado||null;
    const resources=await service.get(cod_cliente,cod_linea_negocio,estado);
    res.json(resources);
  }catch (e){
    next(e);
  }
});

module.exports = router;
