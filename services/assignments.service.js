const sequelize = require('../libs/sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM asignacion_recursos`;
};
const joinService = `INNER JOIN servicio ON servicio.cod_servicio = asignacion_recursos.cod_servicio`;

class AssignmentsService{

  async findByCodColaboradorJoinServicio(codColaborador, fechaIni, fechaFin) {
    // Columnas
    const select = getSelect(['servicio.tipo_servicio', 'servicio.descripcion_servicio',
    'asignacion_recursos.por_asignacion', 'asignacion_recursos.fecha_inicio',
    'asignacion_recursos.fecha_fin']);

    const query=`${ select } ${ joinService }
                WHERE asignacion_recursos.cod_colaborador=${ codColaborador }
                AND asignacion_recursos.fecha_inicio >= '${ fechaIni.toString() }'
                AND asignacion_recursos.fecha_fin <= '${ fechaFin.toString() }';`;
    const [data] = await sequelize.query(query);
    return data;
  }

}
module.exports = AssignmentsService;
