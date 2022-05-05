const express = require('express');
const routerApi = require("./routes");
const { logErrors, boomErrorHandler } = require("./middlewares/error.handler");
const cors = require('cors');

// swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FUturo API",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./routes/*.js"]
}

const app = express();
const port = process.env.PORT ||3000;

app.use(express.json());
app.use(cors());

require('./utils/auth');
app.use(express.static("./public"));


app.get('/', (req, res) => {
  res.send('Hola mundo');
});


routerApi(app);

// middlewares
app.use(logErrors);
app.use(boomErrorHandler);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

const server = app.listen(port, () => {
  console.log('Mi port ' + port);
});

module.exports = { app, server }
