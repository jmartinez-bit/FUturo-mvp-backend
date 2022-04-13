const sequelize = require('../libs/sequelize');

class BusinessLineService{

  async findBusinessLines(){
    const query="SELECT cod_linea_servicio,linea_servicio FROM linea_servicio "+
                "WHERE estado='A' ;";
    const [data] = await sequelize.query(query);
     return data;
  }

}

module.exports = BusinessLineService;
