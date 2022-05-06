const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');
const ResourcesService = require('./resources.service');

// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM periodo`;
};

const getInsert = (attributes = '*') => {
  return `INSERT INTO periodo(${ attributes.toString() })`;
};

const resourcesService = new ResourcesService();

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
    const query = `${ getInsert(fields) }
              VALUES(${ fields.map(field => "(:".concat(field).concat(")")).toString() })
              RETURNING *;`;

    try {
      data.usuario_reg = 'prueba';
      data.estado = 'A';
      const [[ newPeriod ]] = await sequelize.query(query, {
        type: QueryTypes.INSERT,
        replacements: data
      });
      const periodInactive = await this.setEstadoInactive();
      resourcesService.createCopyResources(newPeriod.periodo, periodInactive.periodo);
      return newPeriod;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw boom.conflict('there was a conflict');
      }
    }
  }

  async setEstadoInactive() {
    const query = `UPDATE periodo
            SET estado = 'I'
            WHERE periodo = (SELECT periodo FROM periodo
              ORDER BY fecha_reg DESC OFFSET 1 ROW FETCH FIRST 1 ROW ONLY)
              RETURNING *;`;

    const [[updatePeriod]] = await sequelize.query(query);

    if (!updatePeriod) {
      throw boom.notFound('period not found');
    }

    return updatePeriod;
  }

  async update(data) {

    const query = `UPDATE periodo
            SET tasa_cambio = (:tasa_cambio)
            WHERE estado = 'A' RETURNING *;`;

    const [[updatePeriod]] = await sequelize.query(query, {
      replacements: data,
      type: sequelize.QueryTypes.UPDATE
    });

    if (!updatePeriod) {
      throw boom.notFound('period not found');
    }

    return updatePeriod;
  }

  async getAll() {
    // Columnas
    const select = getSelect(['periodo', 'tasa_cambio', "to_char(fecha_reg, 'dd-mm-yyyy') as fecha_apertura", 'estado']);

    // Sentencia
    const [data] = await sequelize.query(`${ select }
                    ORDER BY fecha_reg DESC;`);

    return data;
  }

}
module.exports = PeriodService;
