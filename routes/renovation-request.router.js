const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles  }  = require('./../middlewares/auth.handler');
const RenovationRequestService = require('./../services/renovation-request.service');

const router = express.Router();
const renovationRequestService = new RenovationRequestService();

// Registrar solicitud de renovacion mismas condiciones o cambio contractual
router.post('/create',
  // validatorHandler(createPeriodSchema, 'body'),
  async (req, res, next) => {
  try {
    const body = req.body;
    res.status(201).json(await renovationRequestService.create(body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
