const sequelize = require('../libs/sequelize');


function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM mapa_recursos`;
};

class ResourcesService{

  constructor(){
    this.resources=[]
  }

  async findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,nombres){
    const select="SELECT cod_mapa_recurso,mapa_recursos.cod_colaborador,linea_negocio,mapa_recursos.estado,puesto AS nombre_perfil,mapa_recursos.nivel,"+
              " fecha_inicio,fecha_fin,asignacion,fecha_fin_contrato,clm_efectivo,produccion,productividad,CONCAT(nombres,' ',apellido_pat,' ',apellido_mat) AS nombre_colaborador "+
             " FROM mapa_recursos "+
             " INNER JOIN colaborador ON mapa_recursos.cod_colaborador=colaborador.cod_colaborador "+
             " INNER JOIN puesto ON mapa_recursos.perfil=puesto.cod_puesto ";
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
    // Aqui se pone en numero de anio y meses ultimos que se quieren visualizar
    // Para este caso son 6 meses
    const ultimosAniosAVisualizar=0;
    const ultimosMesesAVisualizar=6;
    // Se encuentra el periodo activo
    var query="SELECT periodo FROM periodo "+
              "WHERE estado='A' ;";
    var [data] = await sequelize.query(query);
    const periodo=Object.values(data[0])[0];
    const split=periodo.split("-");
    var month=parseInt(split[0],10);
    var year=parseInt(split[1],10);
    // Se calcula el periodo desde el que se quiere listar
    // Para esto se resta al periodo actual los anios y meses a visualizar
    if(month>ultimosMesesAVisualizar){
      month-=ultimosMesesAVisualizar;
      year-=ultimosAniosAVisualizar;
    }else{
      month+=(12-ultimosMesesAVisualizar);
      year-=(ultimosAniosAVisualizar+1);
    }
    //Se realiza el query
    query="SELECT periodo,estado FROM periodo "+
              "WHERE CAST(SUBSTRING(periodo,4,4) AS int)> "+year+
              " OR ( CAST(SUBSTRING(periodo,4,4) AS int)= "+year+" AND CAST(SUBSTRING(periodo,1,2) AS int)>"+month+" ) "+
              "ORDER BY CONCAT(SUBSTRING(periodo,4,4),SUBSTRING(periodo,1,2)) DESC;";//se ordena por periodo descendente
    [data] = await sequelize.query(query);
    return data;
  }

  async findClients(idDM){
    const query="SELECT cartera_cliente.cod_cliente,nombre_corto FROM cliente "+
                "INNER JOIN cartera_cliente ON cliente.cod_cliente=cartera_cliente.cod_cliente "+
                "WHERE cod_usuario="+idDM+" AND cartera_cliente.estado='A' ;";
    const [data] = await sequelize.query(query);
     return data;
  }

  async findByResourceMapID(id) {
    // Columnas
    const select = getSelect(['mapa_recursos.eficiencia', 'mapa_recursos.rendimiento',
    'mapa_recursos.horas_servicio', 'mapa_recursos.licencias', 'mapa_recursos.faltas',
    'mapa_recursos.vacaciones', 'mapa_recursos.horas_extras', 'mapa_recursos.total_horas_asignaciones',
    'mapa_recursos.total_horas_facturables', 'mapa_recursos.capacity']);

    // Sentencia
    const query = `${ select } WHERE mapa_recursos.cod_mapa_recurso=${ id };`;

    const [[data]] = await sequelize.query(query);

    return data;
  }

  async findProfiles(){
    const query="SELECT cod_puesto AS cod_perfil,puesto AS nombre_perfil FROM puesto "+
                "WHERE estado='A';";
    const [data] = await sequelize.query(query);
    return data;
  }


  //Servicio de calculo de monto total
  async findByMontoServicio(cod_cliente,periodo,perfil,nombres){
    // const client = await getConnection();
    let query = "SELECT sum(clm_efectivo) as clm_efectivo, sum(produccion) as produccion, sum(produccion)/sum(clm_efectivo) as productividad" +
    " FROM public.mapa_recursos" +
    " INNER JOIN colaborador ON mapa_recursos.cod_colaborador=colaborador.cod_colaborador" +
    " WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"'"
    if(perfil != null){
      query = query + " AND perfil = '" + perfil + "'"
    }
    if(nombres!=null){
      nombres=nombres.toLowerCase();
      query+=" AND lower(CONCAT(nombres,' ',apellido_pat,' ',apellido_mat)) like '%"+nombres+"%'";
    }
    query = query + ";";
    const [[rta]] = await sequelize.query(query);
    return rta;
  }


  async findCollaboratorNames(cod_cliente,periodo){

    const query=`SELECT colaborador.cod_colaborador,nombres,apellido_pat,apellido_mat FROM colaborador

                 INNER JOIN mapa_recursos ON colaborador.cod_colaborador=mapa_recursos.cod_colaborador

                 WHERE mapa_recursos.cod_cliente=${cod_cliente} AND periodo='${periodo}' ;`;

    const [data] = await sequelize.query(query);

    return data;

  }

  async findCollaboratorsByClientPeriodAndState(cod_cliente,estado,name,nroDoc){
    var [data] = await sequelize.query(`SELECT periodo FROM periodo WHERE estado='A' ;`);
    const periodo=data[0].periodo;
    var query=`SELECT colaborador.cod_colaborador,nro_documento,nombres,apellido_pat,
                 apellido_mat,puesto,mapa_recursos.nivel,contrato.fecha_fin,modalidad,
                 CASE
                WHEN sueldo_planilla IS NOT NULL THEN sueldo_planilla
                WHEN rxh IS NOT NULL THEN rxh
                END importe,bono,mapa_recursos.clm FROM colaborador

                 INNER JOIN mapa_recursos ON colaborador.cod_colaborador=mapa_recursos.cod_colaborador
                 INNER JOIN puesto ON colaborador.cod_puesto=puesto.cod_puesto
                 INNER JOIN contrato ON colaborador.cod_colaborador=contrato.cod_colaborador
                 WHERE mapa_recursos.cod_cliente=${cod_cliente} AND periodo='${periodo}' AND mapa_recursos.estado='${estado}' `;
    if(name){
      name=name.toLowerCase();
      query+=` AND lower(CONCAT(nombres,' ',apellido_pat,' ',apellido_mat)) like '%${name}%' `;
    }
    if(nroDoc){
      query+=` AND nro_documento='${nroDoc}' `;
    }
    query+=" ;";
     [data] = await sequelize.query(query);
    return data;

  }

  //Servicio UH 4
  async findByAperturaMapaRecursosMensual(){
    // const client = await getConnection();
    // const periodo = fecha.getMonth() + 1;
    // console.log(periodo);
    const rta = await sequelize.query("SELECT * FROM public.maparecursos");
    return (await rta).rows;
  }

  async createResourcefromSolicitude(d,codColaborador){
    const [data]=await sequelize.query(`SELECT periodo FROM periodo WHERE estado='A'`);
    const query=`INSERT INTO mapa_recursos (periodo, cod_cliente, linea_negocio, cod_colaborador, perfil, nivel, clm, estado)
      VALUES ('${data[0].periodo}',${d.cod_cliente},'${d.cod_linea_negocio}',${codColaborador},${d.cod_puesto},'${d.nivel}','${d.clm}','A');`;
    await sequelize.query(query);
  }
}


module.exports = ResourcesService;
