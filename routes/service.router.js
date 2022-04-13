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

module.exports = router;
