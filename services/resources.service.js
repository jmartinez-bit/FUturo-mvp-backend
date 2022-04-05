const sequelize = require('../libs/sequelize');

function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM mapa_recursos`;
};

class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,nombres){
    const select="SELECT cod_mapa_recurso,mapa_recursos.cod_colaborador,linea_negocio,mapa_recursos.estado,perfil.nombre_perfil,mapa_recursos.nivel,"+
              "fecha_inicio,fecha_fin,asignacion,fecha_fin_contrato,clm_efectivo,produccion,productividad,CONCAT(nombres,' ',apellido_pat,' ',apellido_mat) AS nombre_colaborador "+
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

  async findClients(idDM,periodo){
    const split=periodo.split("-");
    var year=parseInt(split[1],10);
    var month=parseInt(split[0],10);
    const date="01/"+month+"/"+year;//el primero de este mes
    if(++month===13){
      month=1;
      year+=1;
    }
    const nextDate="01/"+month+"/"+year;//Se usa el dia primero del mes siguiente al periodo para hacer la comparacion con la fecha de asignacion del cliente
    const query="SELECT cartera_cliente.cod_cliente,nombre_corto FROM cliente "+
                "INNER JOIN cartera_cliente ON cliente.cod_cliente=cartera_cliente.cod_cliente "+
                "INNER JOIN servicio ON cliente.cod_cliente=servicio.cod_cliente "+
                "WHERE servicio.fecha_ini_real<CAST('"+nextDate+"' AS date) "+
                "AND (servicio.fecha_fin_real IS NULL OR servicio.fecha_fin_real>=CAST('"+date+"' AS date) ) "+
                "AND cod_usuario="+idDM+";";
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

  // async findByResourceMapID(id) {
  //   // Columnas
  //   const select = getSelect(['mapa_recursos.eficiencia', 'mapa_recursos.rendimiento',
  //   'mapa_recursos.horas_servicio', 'mapa_recursos.licencias', 'mapa_recursos.faltas',
  //   'mapa_recursos.vacaciones', 'mapa_recursos.horas_extras', 'mapa_recursos.total_horas_asignaciones',
  //   'mapa_recursos.total_horas_facturables', 'mapa_recursos.capacity', 'mapa_recursos.cod_colaborador',
  //   'mapa_recursos.fecha_inicio', 'mapa_recursos.fecha_fin']);

  //   // Sentencia
  //   try {
  //     const query = `${ select }
  //               WHERE mapa_recursos.cod_mapa_recurso=${ id };`;
  //   const [[data]] = await sequelize.query(query);

  //   if (!data) return {};
  //   const getContract = await collaboratorService.findByCodColaboradorJoinContrato(data.cod_colaborador);
  //   const getAssignments = await assignmentsService.findByCodColaboradorJoinServicio(data.cod_colaborador, data.fecha_inicio, data.fecha_fin);
  //   delete data.codColaborador;
  //   delete data.fechaInicio;
  //   delete data.fechaFin;

  //   return {productividad: data, contrato: getContract, asignaciones: getAssignments};
  //   } catch(err) {
  //     console.log(err);
  //   }


  // }

  // async findOne(id) {
  //   try {
  //     const mapaRecurso = await models.MapaRecurso.findByPk(id,
  //       {
  //         attributes: ['horasServicio', 'licencias', 'faltas',
  //                      'vacaciones', 'horasExtras', 'totalHorasAsignaciones',
  //                      'totalHorasFacturables', 'eficiencia', 'rendimiento', 'capacity'],
  //         include: [
  //           {
  //             model: models.Colaborador,
  //             as: 'colaborador',
  //             attributes: ['codColaborador', 'nroDocumento', 'nombres',
  //                          'apellidoPat', 'apellidoMat'],
  //             required: true,
  //             include: [
  //               {
  //                 model: models.Servicio,
  //                 attributes: ['tipoServicio', 'descripcionServicio'],
  //                 as: 'servicios',
  //                 required: true,
  //                 through: {
  //                   attributes: ['porAsignacion', 'fechaInicio', 'fechaFin'],
  //                   where: {
  //                     [Op.and]: [
  //                       {
  //                         fechaInicio: {
  //                           [Op.gte]: Sequelize.literal(`(SELECT "fechaInicio"
  //                                                       FROM mapa_recursos
  //                                                       WHERE mapa_recursos."codMapaRecurso" = ${id})`)
  //                         }
  //                       },
  //                       {
  //                         fechaFin: {
  //                           [Op.lte]: Sequelize.literal(`(SELECT "fechaFin"
  //                                                       FROM mapa_recursos
  //                                                       WHERE mapa_recursos."codMapaRecurso" = ${id})`)
  //                         }
  //                       },
  //                     ]
  //                   }
  //                 }
  //               },
  //               {
  //                 model: models.Contrato,
  //                 attributes: ['codContrato', 'modalidad', 'fechaFin',
  //                              'sueldoPlanilla', 'bono', 'eps', 'clm'],
  //                 as: 'contratos',
  //                 required: true,
  //                 order: [['codContrato', 'DESC']],
  //                 limit: 1
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     );
  //     if (!mapaRecurso) {
  //       console.log('no hay recurso');
  //     }
  //     return mapaRecurso;
  //   } catch(er) {
  //     console.log(er);
  //   }

  // }

}
module.exports = ResourcesService;
