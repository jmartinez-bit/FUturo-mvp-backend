const resourcesRouter = require('./resources.router');
const serviceRouter = require('./service.router');
const serviceLineRouter = require('./service-line.router');
const clientRouter = require('./client.router');

const express = require('express');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/resources', resourcesRouter);
  router.use('/services', serviceRouter);
  router.use('/service-line', serviceLineRouter);
  router.use('/clients', clientRouter);
}

module.exports = routerApi;
