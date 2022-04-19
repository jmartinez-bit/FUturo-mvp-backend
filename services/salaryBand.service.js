const sequelize = require('../libs/sequelize');

class SalaryBandService{

  async findSalaryBand(nivel,cod_puesto){
    var niv=nivel.toLowerCase();
    const query="SELECT cod_banda_salarial,minimo,maximo FROM banda_salarial "+
                "WHERE nivel='"+niv+"' AND cod_puesto="+cod_puesto+" ;";
    const [data] = await sequelize.query(query);
     return data;
  }

  async findMax(cod_banda_salarial){
    const query=`SELECT maximo FROM banda_salarial
                WHERE cod_banda_salarial=${cod_banda_salarial} ;`;
    const [data] = await sequelize.query(query);
     return Object.values(data[0])[0];;
  }


}

module.exports = SalaryBandService;
