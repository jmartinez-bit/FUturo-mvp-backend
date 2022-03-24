//const {models}=require('./../libs/sequelize')
const sequelize=require('./../libs/sequelize')

class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientAndPeriod(cliente,periodo){
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
