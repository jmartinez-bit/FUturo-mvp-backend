//const {models}=require('./../libs/sequelize')
//const sequelize=require('./../libs/sequelize')

const getConnection = require('./../libs/postgres');

class ResourcesService{

  constructor(){
    this.resources=[]
  }
 
  async findByClientAndPeriod(cliente,periodo){
      const query="SELECT * FROM maparecursos WHERE cliente='"+cliente+"' AND periodo="+periodo+" ;";
      const [data] = await sequelize.query(query);
      return data;
  }

  async findAll(){
    const client = await getConnection();
    const rta = await client.query('SELECT * FROM public.maparecursos');
    // this.resources.push({
    //   name: "carlos"
    // })
    // return this.resources;
    return (await rta).rows;
    // const query="SELECT * FROM maparecursos";
    // const [data] = await sequelize.query(query);
    // return data;
  }


}
module.exports = ResourcesService;
