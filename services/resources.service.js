//const {models}=require('./../libs/sequelize')
const { object } = require('joi');
const sequelize=require('./../libs/sequelize')

class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientAndPeriod(cliente,periodo){
      const query1="SELECT cod_cliente FROM cliente WHERE nombre_corto='"+cliente+"' ;";
      const [data1] = await sequelize.query(query1);
      const cod_cliente=Object.values(data1[0]);
      const query2="SELECT * FROM mapa_recursos WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' ;";
      const [data2] = await sequelize.query(query2);
      return data2 ;
  }

  async findByProfile(cliente,periodo){
    const query="SELECT * FROM maparecursos WHERE cliente='"+cliente+"' AND periodo="+periodo+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findByNames(cliente,periodo){
    const query="SELECT * FROM maparecursos WHERE cliente='"+cliente+"' AND periodo="+periodo+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findAll(){
    const query="SELECT * FROM maparecursos";
    const [data] = await sequelize.query(query);
    return data;
  }


}
module.exports = ResourcesService;
