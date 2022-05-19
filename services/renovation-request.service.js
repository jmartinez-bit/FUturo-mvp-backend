const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM solicitud_renovacion`;
};

const getInsert = (attributes = '*') => {
  return `INSERT INTO solicitud_renovacion(${ attributes.toString() })`;
};

class RenovationRequestService {

  async create(data) {
    const fields = [
      'opcion_renovacion', 'empresa', 'nueva_modalidad', 'nuevo_sueldo',
      'nuevo_bono', 'nuevo_puesto', 'nuevo_nivel_puesto', 'cod_puesto',
      'nivel', 'modalidad', 'remuneracion', 'modalidad_bono',
      'bono_men', 'estado', 'fecha_fin_ant', 'fecha_inicio_nuevo',
      'fecha_fin_nuevo'
    ];
    // Sentencia
    const query = `${ getInsert(fields) }
              VALUES(${ fields.map(field => "(:".concat(field).concat(")")).toString() })
              RETURNING *;`;

    try {
      const [[ newRequestService ]] = await sequelize.query(query, {
        type: QueryTypes.INSERT,
        replacements: data
      });
      return newRequestService;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw boom.conflict('there was a conflict');
      }
    }
  }

}
module.exports = RenovationRequestService;
