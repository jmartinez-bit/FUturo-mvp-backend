const sequelize = require('../libs/sequelize');

class EpsService{

  async findAll(){
    const query=`SELECT * from eps; `;
    const [data] = await sequelize.query(query);
     return data;
  }

  async findAmount(cod_eps){
    const query=`SELECT monto_eps from eps
                WHERE cod_eps=${cod_eps}; `;
    const [data] = await sequelize.query(query);
    return Object.values(data[0])[0];;

  }
}

module.exports = EpsService;
