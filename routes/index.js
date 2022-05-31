const passport = require('passport');

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
const authRouter  = require('./auth.router');
const parameterRouter = require('./parameter.router');
const uploadFileRouter = require('./uploadFile.router');
const solicitudeRouter = require('./solicitude.router');
const renovationRequestRouter = require('./renovation-request.router');


const express = require('express');


function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/resources', passport.authenticate('jwt', {session: false}), resourcesRouter);
  router.use('/services', passport.authenticate('jwt', {session: false}), serviceRouter);
  router.use('/service-line', passport.authenticate('jwt', {session: false}), serviceLineRouter);
  router.use('/clients', passport.authenticate('jwt', {session: false}), clientRouter);
  router.use('/payment-service', passport.authenticate('jwt', {session: false}), paymentServicesRouter);
  router.use('/service-type', passport.authenticate('jwt', {session: false}), serviceTypeRouter);
  router.use('/payment-method', passport.authenticate('jwt', {session: false}), paymentMethodRouter);
  router.use('/period', passport.authenticate('jwt', {session: false}), periodRouter);
  router.use('/businessLine', passport.authenticate('jwt', {session: false}), businessLineRouter);
  router.use('/salaryBand', passport.authenticate('jwt', {session: false}), salaryBandRouter);
  router.use('/contract', passport.authenticate('jwt', {session: false}), contractRouter);
  router.use('/contractSolicitude', passport.authenticate('jwt', {session: false}), contractSolicitudeRouter);
  router.use('/eps', passport.authenticate('jwt', {session: false}), epsRouter);
  router.use('/assignedHours', passport.authenticate('jwt', {session: false}), assignedHoursRouter);
  router.use('/assignments', passport.authenticate('jwt', {session: false}), assignmentsRouter);
  router.use('/solicitude', passport.authenticate('jwt', {session: false}), solicitudeRouter);
  router.use('/renovation-request', passport.authenticate('jwt', {session: false}), renovationRequestRouter);
  router.use('/auth', authRouter);
  router.use('/parameter', parameterRouter);
  router.use('/uploadFile', uploadFileRouter);
}

module.exports = routerApi;
