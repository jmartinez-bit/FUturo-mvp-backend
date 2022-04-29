const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM periodo`;
};

const getInsert = (attributes = '*') => {
  return `INSERT INTO periodo(${ attributes.toString() })`;
};

class PeriodService{

  async getLastPeriod() {
    // Columnas
    const select = getSelect(['periodo', 'tasa_cambio']);

    // Sentencia
    const [[data]] = await sequelize.query(`${ select }
                    WHERE estado = 'A'
                    ORDER BY fecha_reg DESC LIMIT 1;`);

    return data;
  }

  async create(data) {
    const fields = [
      'periodo', 'tasa_cambio', 'usuario_reg', 'estado'
    ];
    // Sentencia
    const insert = getInsert(fields);
    const query = `${ insert } VALUES(${ fields.map(field => "(:".concat(field).concat(")")).toString() }) RETURNING *;`;

    try {

      data.usuario_reg = 'prueba';
      data.estado = 'A';
      const [[ newPeriod ]] = await sequelize.query(query, {
        type: QueryTypes.INSERT,
        replacements: data
      });
      return newPeriod;

    } catch (error) {

      if (error.name === 'SequelizeUniqueConstraintError') {
        console.error(error);
        throw boom.conflict('there was a conflict');
      }

    }
  }

}
module.exports = PeriodService;
