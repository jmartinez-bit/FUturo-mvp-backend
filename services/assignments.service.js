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

}
module.exports = AssignmentsService;
