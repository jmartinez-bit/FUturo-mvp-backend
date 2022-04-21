const resourcesRouter = require('./resources.router');
const businessLineRouter = require('./businessLine.router');
const salaryBandRouter = require('./salaryBand.router');
const contractRouter = require('./contract.router');
const contractSolicitudeRouter = require('./contractSolicitude.router');
const epsRouter = require('./eps.router');
const clientRouter = require('./client.router');





const express = require('express');


function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/resources', resourcesRouter);
  router.use('/businessLine', businessLineRouter);
  router.use('/salaryBand', salaryBandRouter);
  router.use('/contract', contractRouter);
  router.use('/contractSolicitude', contractSolicitudeRouter);
  router.use('/eps', epsRouter);
  router.use('/clients', clientRouter);




}

module.exports = routerApi;
