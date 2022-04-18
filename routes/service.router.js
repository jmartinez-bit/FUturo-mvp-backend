const express = require('express');
const ServicesService = require('./../services/services.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { createServiceSchema } = require('./../schemas/service.schema');


const router = express.Router();
const service = new ServicesService();

// Crear un servicio
router.post('/create',
  validatorHandler(createServiceSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      res.status(201).json(await service.create(body));
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
