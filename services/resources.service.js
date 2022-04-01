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

  async findByMontoServicio(cod_cliente,periodo,perfil,cod_colaborador){
    const client = await getConnection();
    let query = "SELECT sum(clm_efectivo) as clm_efectivo, sum(produccion) as produccion, sum(produccion)/sum(clm_efectivo) as productividad FROM public.maparecursos WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"'"
    if(perfil != null){
      query = query + " AND perfil = '" + perfil + "'"
    }
    if(cod_colaborador != null){
      query = query + " AND cod_colaborador = " + cod_colaborador 
    }
    const rta = await client.query(query);
    return (await rta).rows;
  }

  async findAll(cod_cliente,periodo){
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
