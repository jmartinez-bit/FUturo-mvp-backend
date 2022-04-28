const sequelize = require('../libs/sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM asignacion_recursos`;
};
const joinService = `INNER JOIN servicio ON servicio.cod_servicio = asignacion_recursos.cod_servicio`;

class AssignmentsService{

  async findByCodColaboradorJoinServicio(cod_colaborador, periodo, cod_cliente) {

      // Columnas
    const select = getSelect(['servicio.tipo_servicio', 'servicio.descripcion_servicio',
    'asignacion_recursos.por_asignacion', 'asignacion_recursos.fecha_inicio',
    'asignacion_recursos.fecha_fin']);

    const query=`${ select } ${ joinService }
                WHERE asignacion_recursos.cod_colaborador=${ cod_colaborador }
                AND servicio.cod_cliente = ${ cod_cliente }
                AND to_date('${ periodo }', 'MM-YYYY') <= fecha_fin;`;
    const [data] = await sequelize.query(query);
    return data;

  }

  async maxAccumulatedAssignedPercentageInAnInterval(fechaIni,fechaFin,codColaborador){
    const query=`SELECT cod_asignacion,fecha_inicio,fecha_fin,por_asignacion FROM asignacion_recurso
                 WHERE cod_colaborador=${codColaborador}
                 AND (
                 fecha_inicio<= to_date('${ fechaFin }', 'YYYY-MM-DD') AND fecha_fin>=to_date('${ fechaIni }', 'YYYY-MM-DD')
                 )
                 ORDER BY fecha_inicio ASC ;`;
    const [data]=await sequelize.query(query);
    var fechas=[];
    //El array fechas tendra 3 campos:
    //-fecha
    //-modificador_porcentaje : cuando es el inicio de una asignacion se suma el porcentaje de esa asignacion,si es el final se resta.
    //-ind :  indica si es una fecha de asignacion de inicio o de fin(FA) o si es el inicio(INI) o fin(FIN) del intervalo evaluado
    data.forEach(element => fechas.push({"fecha":element.fecha_inicio,"modificador_porcentaje":element.por_asignacion,"ind":"FA"}));
    data.forEach(element => fechas.push({"fecha":element.fecha_fin,"modificador_porcentaje":element.por_asignacion*(-1),"ind":"FA"}));
    fechas.push({"fecha":fechaIni,"modificador_porcentaje":0,"ind":"INI"});
    fechas.push({"fecha":fechaFin,"modificador_porcentaje":0,"ind":"FIN"});
    var sortedFechas=fechas.sort((a, b) =>{
      if (new Date(a.fecha).getTime() === new Date(b.fecha).getTime()) {
        return b.modificador_porcentaje-a.modificador_porcentaje;
      }else{
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      }
    });

    var porcentajes=[0];
    var porc=0;
    sortedFechas.forEach(element=>{
       porc+=element.modificador_porcentaje;
       porcentajes.push(porc);//el array porcentaje tendrá los acumulados
    })
    //console.log(sortedFechas);
    //console.log(porcentajes);

    var indexIni = sortedFechas.findIndex(a=> a.ind == "INI");
    var indexFin = sortedFechas.findIndex(a=> a.ind == "FIN");
    //console.log(indexIni);
    //console.log(indexFin);
    porcentajes=porcentajes.slice(indexIni+1, indexFin+1)
    //console.log(porcentajes);

    var max = Math.max(...porcentajes);

    return max;
  }

}
module.exports = AssignmentsService;
