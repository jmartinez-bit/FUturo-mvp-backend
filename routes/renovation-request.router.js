const express = require('express');
const RenovationRequestService = require('./../services/renovation-request.service');

const router = express.Router();
const renovationRequestService = new RenovationRequestService();

router.post('/create',
  async (req, res, next) => {
  try {
    const body = req.body;
    if(body.opcion_renovacion==="mismas condiciones"){
      const data=await renovationRequestService.modifyDataInput(body);
      if(data.fecha_fin_nuevo<data.fecha_inicio_nuevo){
        res.status(409).json({"error":true,
        "message":"La fecha de fin del nuevo contrato debe ser mayor la fecha de inicio"});
      }else{
        res.status(201).json(await renovationRequestService.create(data));
      }
    }else{
        res.status(409).json({"error":true,
        "message":"Opcion de renovacion equivocada. La opcion: '"+body.opcion_renovacion+ "' no está implementada"});
    }

  } catch (error) {
    next(error);
  }
});

router.get('/auto/:cod_mapa_recurso',
  async (req, res, next) => {
  try {
    const {cod_mapa_recurso} = req.params;
    res.status(201).json(await renovationRequestService.fillDataAutocompleted(cod_mapa_recurso));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
