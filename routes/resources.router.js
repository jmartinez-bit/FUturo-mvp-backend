const express = require('express');
const AssignmentsService = require('../services/assignments.service');
const CollaboratorService = require('../services/collaborator.service');
const ResourcesService = require('./../services/resources.service');

const router = express.Router();
const service = new ResourcesService();
const collaboratorService = new CollaboratorService();
const assignmentsService = new AssignmentsService();

router.get('/', async (req, res, next) => {
  try {
    const resources = await service.findAll();
    res.json(resources);
  } catch (e) {
    next(e);
  }
});

// router.get('/colaborador/:resmapid', async (req, res, next) => {
//   try {
//     const { resmapid } = req.params;
//     const colaborador = await service.findByResourceMapID(resmapid);
//     res.json(colaborador);
//   } catch (error) {
//     next(error);
//   }
// });

router.get('/productividad/:resmapid', async (req, res, next) => {
  try {
    const { resmapid } = req.params;
    const resource = await service.findByResourceMapID(resmapid);
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

router.get('/contrato/:id/:fecFin', async (req, res, next) => {
  try {
    const { id, fecFin } = req.params;
    const contract = await collaboratorService.findByCodColaboradorJoinContrato(id, fecFin);
    res.json(contract);
  } catch (error) {
    next(error);
  }
});

router.get('/asignaciones/:id/:fecIni/:fecFin', async (req, res, next) => {
  try {
    const { id, fecIni, fecFin } = req.params;
    const assignments = await assignmentsService.findByCodColaboradorJoinServicio(id, fecIni, fecFin);
    res.json(assignments);
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
