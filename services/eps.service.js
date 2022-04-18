const sequelize = require('../libs/sequelize');

class EpsService{

  async findAll(){
    const query=`SELECT * from eps; `;
    const [data] = await sequelize.query(query);
     return data;
  }

}

module.exports = EpsService;
