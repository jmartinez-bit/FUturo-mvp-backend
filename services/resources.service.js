//const {models}=require('./../libs/sequelize')
const { object } = require('joi');
const sequelize=require('./../libs/sequelize')

class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientAndPeriod(cod_cliente,periodo){
      const query="SELECT * FROM mapa_recursos WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' ;";
      const [data] = await sequelize.query(query);
      return data ;
  }

  async findByClientPeriodAndProfile(cod_cliente,periodo,cod_perfil){
    const query="SELECT * FROM mapa_recursos WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' AND perfil="+cod_perfil+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findByClientPeriodAndNames(cod_cliente,periodo,cod_colab){
    const query="SELECT * FROM mapa_recursos WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' AND cod_colaborador="+cod_colab+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,cod_colab){
    const query="SELECT * FROM mapa_recursos WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' AND perfil="+cod_perfil+" AND cod_colaborador="+cod_colab+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findPeriods(){
    const query="SELECT periodo FROM periodo";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findCustomers(idDM){
    const query="SELECT cartera_cliente.cod_cliente,nombre_corto FROM cliente INNER JOIN cartera_cliente ON cliente.cod_cliente=cartera_cliente.cod_cliente WHERE cod_usuario="+idDM+";";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findProfiles(){
    const query="SELECT cod_perfil,nombre_perfil FROM perfil;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findCollaboratorNames(){
    const query="SELECT cod_colaborador,nombres,apellido_pat,apellido_mat FROM colaborador;";
    const [data] = await sequelize.query(query);
    return data;
  }
}
module.exports = ResourcesService;
