const sequelize = require('../libs/sequelize');

class ParameterService{

  async findParameterValue(nombreParametro){
    const query=`SELECT valor_num_1,valor_num_2,valor_num_3,valor_char_1,valor_char_2,valor_char_3
                 FROM parametro_negocio WHERE parametro='${nombreParametro}'; `;
    const [data] = await sequelize.query(query);
     return data;
  }

}

module.exports = ParameterService;
