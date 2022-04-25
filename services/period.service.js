const sequelize = require('../libs/sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM periodo`;
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

}
module.exports = PeriodService;
