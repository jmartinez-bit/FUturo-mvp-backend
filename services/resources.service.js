//const {models}=require('./../libs/sequelize')
//const sequelize=require('./../libs/sequelize')

const getConnection = require('./../libs/postgres');

class ResourcesService{

  constructor(){
    this.resources=[]
  }

  async findAll(){
    const client = await getConnection();
    const rta = await client.query("SELECT * FROM public.maparecursos");
    return (await rta).rows;
  }

  //Servicio de calculo de monto total
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


  //Servicio UH 4
  async findByAperturaMapaRecursosMensual(){
    const client = await getConnection();
    // const periodo = fecha.getMonth() + 1;
    // console.log(periodo);
    const rta = await client.query("SELECT * FROM public.maparecursos");
    return (await rta).rows;
  }


}
module.exports = ResourcesService;
