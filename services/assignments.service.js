const sequelize = require('../libs/sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM "asignacion-recursi"`;
};
const joinService = `INNER JOIN servicio ON servicio."codServicio" = "asignacion-recursi"."codServicio"`;

class AssignmentsService{

  async findByCodColaboradorJoinServicio(codColaborador, fechaIni, fechaFin) {
    // Columnas
    const select = getSelect(['servicio."tipoServicio"', 'servicio."descripcionServicio"',
    '"asignacion-recursi"."porAsignacion"', '"asignacion-recursi"."fechaInicio"',
    '"asignacion-recursi"."fechaFin"']);

    const query=`${ select } ${ joinService }
                WHERE "asignacion-recursi"."codColaborador"=${ codColaborador }
                AND "asignacion-recursi"."fechaInicio" >= '${ fechaIni.toISOString() }'
                AND "asignacion-recursi"."fechaFin" <= '${ fechaFin.toISOString() }';`;
    const [data] = await sequelize.query(query);
    return data;
  }

}
module.exports = AssignmentsService;
