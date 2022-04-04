const express = require('express');
const routerApi = require("./routes");
const cors=require('cors');

const app = express();
const port = 3000;

app.use(express.json());

const whitelist = ['http://localhost:4200', 'https://myapp'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}

app.use(cors(options));

app.get('/', (req, res) => {
  res.send('Hola mundo');
});

routerApi(app);

app.listen(port, () => {
  console.log('Mi port ' + port);
});
