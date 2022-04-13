const express = require('express');
const routerApi = require("./routes");
const { logErrors, boomErrorHandler } = require("./middlewares/error.handler");

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hola mundo');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);

app.listen(port, () => {
  console.log('Mi port ' + port);
});
