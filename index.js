const express = require('express');
const routerApi = require("./routes");
const cors=require('cors');

const app = express();
<<<<<<< HEAD
const port = process.env.PORT || 3000;
=======
const port = process.env.PORT ||3000;
>>>>>>> fddbdd7961f019e732af26e631ca96b44fd5ae7d

app.use(express.json());


app.use(cors());

app.get('/', (req, res) => {
  res.send('Hola mundo');
});


routerApi(app);

app.listen(port, () => {
  console.log('Mi port ' + port);
});
