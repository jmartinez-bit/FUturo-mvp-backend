//const {models}=require('./../libs/sequelize')
//const { object } = require('joi');
const sequelize=require('./../libs/sequelize')

const select="SELECT linea_negocio,mapa_recursos.estado,perfil.nombre_perfil,mapa_recursos.nivel,fecha_inicio,fecha_fin,asignacion,clm_efectivo,produccion,productividad,CONCAT(nombres,' ',apellido_pat,' ',apellido_mat) AS nombre_colaborador "+
             "FROM mapa_recursos INNER JOIN colaborador ON mapa_recursos.cod_colaborador=colaborador.cod_colaborador "+
             "INNER JOIN perfil ON mapa_recursos.perfil=perfil.cod_perfil ";

class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientAndPeriod(cod_cliente,periodo){
      const query=select+
                  "WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' ;";
      const [data] = await sequelize.query(query);
      return data ;
  }

  async findByClientPeriodAndProfile(cod_cliente,periodo,cod_perfil){
    const query=select+
                "WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' AND mapa_recursos.perfil="+cod_perfil+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findByClientPeriodAndNames(cod_cliente,periodo,cod_colab){
    const query=select+
                "WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' AND mapa_recursos.cod_colaborador="+cod_colab+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,cod_colab){
    const query=select+
                "WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' AND mapa_recursos.perfil="+cod_perfil+" AND mapa_recursos.cod_colaborador="+cod_colab+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findPeriods(){
    const query="SELECT periodo FROM periodo";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findCustomers(idDM){
    const query="SELECT cartera_cliente.cod_cliente,nombre_corto FROM cliente INNER JOIN cartera_cliente ON cliente.cod_cliente=cartera_cliente.cod_cliente "+
                "WHERE cartera_cliente.estado='A' AND cod_usuario="+idDM+";";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findProfiles(){
    const query="SELECT cod_perfil,nombre_perfil FROM perfil "+
                "WHERE estado='A';";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findCollaboratorNames(cod_cliente){
    const query="SELECT cod_colaborador,nombres,apellido_pat,apellido_mat FROM colaborador "+
                "WHERE EXISTS(SELECT cod_colaborador FROM mapa_recursos WHERE colaborador.cod_colaborador=mapa_recursos.cod_colaborador "+
                "AND mapa_recursos.cod_cliente="+cod_cliente+")";
    const [data] = await sequelize.query(query);
    return data;
  }

}
module.exports = ResourcesService;
