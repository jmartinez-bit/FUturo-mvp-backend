const resourcesRouter = require('./resources.router');
const serviceRouter = require('./service.router');
const serviceLineRouter = require('./service-line.router');
const clientRouter = require('./client.router');
const paymentServicesRouter = require('./payment-services.router');
const serviceTypeRouter = require('./service-type.router');
const paymentMethodRouter = require('./payment-method.router');
const periodRouter = require('./period.router');
const businessLineRouter = require('./businessLine.router');
const salaryBandRouter = require('./salaryBand.router');
const contractRouter = require('./contract.router');
const contractSolicitudeRouter = require('./contractSolicitude.router');
const epsRouter = require('./eps.router');
const assignedHoursRouter = require('./assignedHours.router');
const assignmentsRouter = require('./assignments.router');

const express = require('express');


function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/resources', resourcesRouter);
  router.use('/services', serviceRouter);
  router.use('/service-line', serviceLineRouter);
  router.use('/clients', clientRouter);
  router.use('/payment-service', paymentServicesRouter);
  router.use('/service-type', serviceTypeRouter);
  router.use('/payment-method', paymentMethodRouter);
  router.use('/period', periodRouter);
  router.use('/businessLine', businessLineRouter);
  router.use('/salaryBand', salaryBandRouter);
  router.use('/contract', contractRouter);
  router.use('/contractSolicitude', contractSolicitudeRouter);
  router.use('/eps', epsRouter);
  router.use('/assignedHours', assignedHoursRouter);
  router.use('/assignments', assignmentsRouter);

}

module.exports = routerApi;
