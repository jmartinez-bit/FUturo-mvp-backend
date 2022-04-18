const express = require('express');
const PaymentMethodService = require('./../services/payment-method.service');

const router = express.Router();
const paymentMethodService = new PaymentMethodService();

// Buscar formas de pago por codigo de tipo de servicio
router.get('/:codTipoServicio', async (req, res, next) => {
  try {
    const { codTipoServicio } = req.params;
    const paymentMethods = await paymentMethodService.findByCodTipoServicio(codTipoServicio);
    res.json(paymentMethods);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
