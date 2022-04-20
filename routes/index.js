const resourcesRouter = require('./resources.router');
const paymentServicesRouter = require('./payment-services.router');

const express = require('express');


function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/resources', resourcesRouter);
  router.use('/payment-service', paymentServicesRouter);
}

module.exports = routerApi;
