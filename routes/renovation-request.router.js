const express = require('express');
const RenovationRequestService = require('./../services/renovation-request.service');

const router = express.Router();
const renovationRequestService = new RenovationRequestService();

router.post('/create',
  async (req, res, next) => {
  try {
    const body = req.body;
    const data=await renovationRequestService.modifyDataInput(body);
    res.status(201).json(await renovationRequestService.create(data));
  } catch (error) {
    next(error);
  }
});

router.get('/collaborator/:cod',
  async (req, res, next) => {
  try {
    const {cod}=req.params;
    res.status(201).json(await renovationRequestService.findCollaboratorData(cod));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
