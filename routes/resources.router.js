const express = require('express');
const ResourcesService = require('./../services/resources.service');

const router = express.Router();
const service = new ResourcesService();

router.get('/', async (req, res, next) => {
  try {
    const resources = await service.findAll();
    res.json(resources);
  } catch (e) {
    next(e);
  }
});

router.get('/colaborador/:resmapid', async (req, res, next) => {
  try {
    const { resmapid } = req.params;
    const colaborador = await service.findOne(resmapid);
    res.json(colaborador);
  } catch (error) {
    next(error);
  }
});

// router.get('/:cliente/:periodo', async (req, res, next) => {
//   try {
//     const { cliente, periodo } = req.params;
//     const resources = await service.findByClientAndPeriod(cliente, periodo);
//     res.json(resources);
//   } catch (e) {
//     next(e);
//   }
// });

module.exports = router;
