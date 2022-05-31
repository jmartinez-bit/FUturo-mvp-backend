const sequelize = require('../libs/sequelize');

class EpsService{

  async findAll(){
    const query=`SELECT * from eps; `;
    const [data] = await sequelize.query(query);
     return data;
  }

  async findAmount(cod_eps,parcial_total){
    const query=`SELECT ${parcial_total} from eps
                WHERE cod_eps=${cod_eps}; `;
    const [[data]] = await sequelize.query(query);
    return parseFloat(Object.values(data));

  }
}

module.exports = EpsService;
