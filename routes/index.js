const resourcesRouter = require('./resources.router');

const express = require('express');


function routerApi(app) {
  const router=express.Router();
 app.use('/api/v1',router);
 router.use('/resources', resourcesRouter);

}

module.exports = routerApi;
