const sequelize = require('../libs/sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM asignacion_recursos`;
};
const joinService = `INNER JOIN servicio ON servicio.cod_servicio = asignacion_recursos.cod_servicio`;

class AssignmentsService{

  async findByCodColaboradorJoinServicio(cod_colaborador, periodo, cod_cliente) {

    const {year, month} = {
      year: parseInt(periodo.substr(3)),
      month: parseInt(periodo.substring(0, 2))
    }

      // Columnas
    const select = getSelect(['servicio.tipo_servicio', 'servicio.descripcion_servicio',
    'asignacion_recursos.por_asignacion', 'asignacion_recursos.fecha_inicio',
    'asignacion_recursos.fecha_fin']);

    const query=`${ select } ${ joinService }
                WHERE asignacion_recursos.cod_colaborador=${ cod_colaborador }
                AND (${ year } = extract(year from fecha_inicio) AND ${ year } = extract(year from fecha_fin))
                AND (${ month } between extract(month from fecha_inicio) AND extract(month from fecha_fin))
                AND servicio.cod_cliente = ${ cod_cliente };`;
    const [data] = await sequelize.query(query);
    return data;

  }

}
module.exports = AssignmentsService;
