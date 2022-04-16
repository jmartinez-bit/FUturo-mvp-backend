const sequelize = require('../libs/sequelize');

class SalaryBandService{

  async findSalaryBand(nivel,cod_puesto){
    const query="SELECT cod_banda_salarial,minimo,maximo FROM banda_salarial "+
                "WHERE nivel='"+nivel+"' AND cod_puesto="+cod_puesto+" ;";
    const [data] = await sequelize.query(query);
     return data;
  }

}

module.exports = SalaryBandService;
