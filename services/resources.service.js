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

  async findBySumClientAndPeriod(cliente,periodo){
    const client = await getConnection();
    const rta = await client.query("SELECT sum(clm_efectivo) as clm_efectivo, sum(produccion) as produccion, sum(produccion)/sum(clm_efectivo) as productividad FROM public.maparecursos WHERE cod_cliente="+cliente+" AND periodo='"+periodo+"'");
    // this.resources.push({
    //   name: "carlos"
    // })
    // return this.resources;
    return (await rta).rows;
    // const query="SELECT * FROM maparecursos";
    // const [data] = await sequelize.query(query);
    // return data;
  }

  async findAll(cliente,periodo){
    const client = await getConnection();
    const rta = await client.query("SELECT * FROM public.maparecursos");
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
