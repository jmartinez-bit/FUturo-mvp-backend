const sequelize = require('../libs/sequelize');

class ClienteService{

  async findAll(){
    const query=`SELECT cod_cliente,nombre_corto FROM cliente WHERE estado='activo' ;`;
    const [data] = await sequelize.query(query);
     return data;
  }

}

module.exports = ClienteService;
