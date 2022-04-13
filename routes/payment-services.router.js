const express = require('express');
const PaymentServicesService = require('./../services/payment-services.service');

const router = express.Router();
const paymentService = new PaymentServicesService();

// Obtener todas las lineas de servicio
router.post('/create', async (req, res, next) => {
  try {
    const body = req.body;
    res.status(201).json(await paymentService.create(body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
