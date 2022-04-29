const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const { createPeriodSchema } = require('../schemas/period.schema');
const PeriodService = require('./../services/period.service');

const router = express.Router();
const periodService = new PeriodService();

// TODO: Documentar apis
router.get('/last-period', async (req, res, next) => {
  try {
    const lastPeriod = await periodService.getLastPeriod();
    res.json(lastPeriod);
  } catch (error) {
    next(error);
  }
});

router.post('/create',
  validatorHandler(createPeriodSchema, 'body'),
  async (req, res, next) => {
  try {
    const body = req.body;
    res.status(201).json(await periodService.create(body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
