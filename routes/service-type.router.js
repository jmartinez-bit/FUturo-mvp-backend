const express = require('express');
const ServiceTypeService = require('./../services/service-type.service');

const router = express.Router();
const serviceTypesService = new ServiceTypeService();

// Buscar tipos de servicio por codigo de linea de servicio
router.get('/linea-servicio/:codLineaServicio', async (req, res, next) => {
  try {
    const { codLineaServicio } = req.params;
    const serviceTypes = await serviceTypesService.findByCodLineaServicio(codLineaServicio);
    res.json(serviceTypes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
