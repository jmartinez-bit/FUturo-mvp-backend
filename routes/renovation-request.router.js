const express = require('express');
const RenovationRequestService = require('./../services/renovation-request.service');

const router = express.Router();
const renovationRequestService = new RenovationRequestService();

router.post('/create',
  async (req, res, next) => {
  try {
    const body = req.body;
    res.status(201).json(await renovationRequestService.create(body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
