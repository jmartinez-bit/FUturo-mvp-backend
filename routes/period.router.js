const express = require('express');
const PeriodService = require('./../services/period.service');

const router = express.Router();
const periodService = new PeriodService();

router.get('/last-period', async (req, res, next) => {
  try {
    const lastPeriod = await periodService.getLastPeriod();
    res.json(lastPeriod);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
