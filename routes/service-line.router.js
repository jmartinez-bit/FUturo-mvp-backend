const express = require('express');
const ServiceLineService = require('./../services/service-line.service');

const router = express.Router();
const serviceLine = new ServiceLineService();

// Obtener todas las lineas de servicio
router.get('/all', async (req, res, next) => {
  try {
    const serviceLines = await serviceLine.getAll();
    res.json(serviceLines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
