const sequelize = require('../libs/sequelize');

// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM linea_servicio`;
};

class ServiceLineService{

  async getAll() {
    // Columnas
    const select = getSelect(['cod_linea_servicio', 'linea_servicio']);

    // Sentencia
    const [data] = await sequelize.query(`${ select } WHERE estado='A';`);

    return data;
  }

}
module.exports = ServiceLineService;
