//const {models}=require('./../libs/sequelize')
//const { object } = require('joi');
const sequelize=require('./../libs/sequelize')


class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,nombres){
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
    if(nombres!=null){
      nombres=nombres.toLowerCase();
      query+=" AND lower(CONCAT(nombres,' ',apellido_pat,' ',apellido_mat)) like '%"+nombres+"%'";
    }
    query+=" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findPeriods(){
    const ultimosAniosAVisualizar=0;
    const ultimosMesesAVisualizar=6;
    var query="SELECT periodo FROM periodo "+
              "WHERE estado='A' ;";
    var [data] = await sequelize.query(query);
    const periodo=Object.values(data[0])[0];
    const split=periodo.split("-");
    var month=parseInt(split[0],10);
    var year=parseInt(split[1],10);
    if(month>ultimosMesesAVisualizar){
      month-=ultimosMesesAVisualizar;
      year-=ultimosAniosAVisualizar;
    }else{
      month+=(12-ultimosMesesAVisualizar);
      year-=(ultimosAniosAVisualizar+1);
    }
        query="SELECT periodo,estado FROM periodo "+
              "WHERE CAST(SUBSTRING(periodo,4,4) AS int)> "+year+
              " OR ( CAST(SUBSTRING(periodo,4,4) AS int)= "+year+" AND CAST(SUBSTRING(periodo,1,2) AS int)>"+month+" ) "+
              "ORDER BY CONCAT(SUBSTRING(periodo,4,4),SUBSTRING(periodo,1,2)) DESC;";
        [data] = await sequelize.query(query);
    return data;
  }

  async findClients(idDM,periodo){
    const split=periodo.split("-");
    var year=parseInt(split[1],10);
    var month=(parseInt(split[0],10)+1);
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
