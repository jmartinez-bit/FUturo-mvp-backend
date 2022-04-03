//const {models}=require('./../libs/sequelize')
//const { object } = require('joi');
const sequelize=require('./../libs/sequelize')


class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,cod_colab){
    const select="SELECT mapa_recursos.cod_colaborador,linea_negocio,mapa_recursos.estado,perfil.nombre_perfil,mapa_recursos.nivel,"+
              "fecha_inicio,fecha_fin,asignacion,clm_efectivo,produccion,productividad,CONCAT(nombres,' ',apellido_pat,' ',apellido_mat) AS nombre_colaborador "+
             "FROM mapa_recursos "+
             "INNER JOIN colaborador ON mapa_recursos.cod_colaborador=colaborador.cod_colaborador "+
             "INNER JOIN perfil ON mapa_recursos.perfil=perfil.cod_perfil ";
    var query=select+
                "WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' ";
    if(cod_perfil!=null){
      query+=" AND mapa_recursos.perfil="+cod_perfil;
    }
    if(cod_colab!=null){
      query+=" AND mapa_recursos.cod_colaborador="+cod_colab;
    }
    query+=" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findPeriods(){
    const query="SELECT periodo,estado FROM periodo "+
                "WHERE CAST(SUBSTRING(periodo,1,4) AS int)>= 2021 ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findCustomers(idDM,periodo){
    const split=periodo.split("-");
    var year=parseInt(split[0],10);
    var month=(parseInt(split[1],10)+1);
    if(month===13){
      month=1;
      year+=1;
    }
    const date="01/"+month+"/"+year;
    const query="SELECT cartera_cliente.cod_cliente,nombre_corto FROM cliente INNER JOIN cartera_cliente ON cliente.cod_cliente=cartera_cliente.cod_cliente "+
                "WHERE cartera_cliente.estado='A' AND fecha_asignacion<= CAST('"+date+"' AS date) AND cod_usuario="+idDM+";";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findProfiles(){
    const query="SELECT cod_perfil,nombre_perfil FROM perfil "+
                "WHERE estado='A';";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findCollaboratorNames(cod_cliente,periodo){
    const query="SELECT colaborador.cod_colaborador,nombres,apellido_pat,apellido_mat FROM colaborador "+
                "INNER JOIN mapa_recursos ON colaborador.cod_colaborador=mapa_recursos.cod_colaborador "+
                "WHERE mapa_recursos.cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' ;";
    const [data] = await sequelize.query(query);
    return data;
  }

}
module.exports = ResourcesService;
