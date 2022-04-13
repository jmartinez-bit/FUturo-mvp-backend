const resourcesRouter = require('./resources.router');
const businessLineRouter = require('./businessLine.router');
const salaryBandRouter = require('./salaryBand.router');


const express = require('express');


function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/resources', resourcesRouter);
  router.use('/businessLine', businessLineRouter);
  router.use('/salaryBand', salaryBandRouter);

}

module.exports = routerApi;
