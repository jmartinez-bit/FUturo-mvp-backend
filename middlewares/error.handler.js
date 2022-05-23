function logErrors (err, _req, _res, next) {
  console.error(err);
  next(err);
}

function boomErrorHandler(err, _req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}


module.exports = { logErrors, boomErrorHandler }
