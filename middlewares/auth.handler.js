const boom = require('@hapi/boom');

const { config } = require('../config/config');


function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}

function checkRoles(...roles) {
  return (req, res, next) => {
    if (roles.includes(config.role)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  }

}


module.exports = { checkApiKey, checkRoles }
