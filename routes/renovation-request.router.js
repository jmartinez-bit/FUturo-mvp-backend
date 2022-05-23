const express = require('express');
const RenovationRequestService = require('./../services/renovation-request.service');

const router = express.Router();
const renovationRequestService = new RenovationRequestService();

router.post('/create',
  async (req, res, next) => {
  try {
    const body = req.body;
    const data=await renovationRequestService.modifyDataInput(body);
    res.status(201).json(await renovationRequestService.create(data));
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
