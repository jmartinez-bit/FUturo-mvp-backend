const sequelize = require('../libs/sequelize');

// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM tipo_servicio`;
};

class ServiceTypeService{

  async findByCodLineaServicio(codLineaServicio) {
    // Columnas
    const select = getSelect(['cod_tipo_servicio', 'nombre_tipo_servicio']);

    // Sentencia
    const [data] = await sequelize.query(`${ select } WHERE cod_linea_servicio='${ codLineaServicio }';`);

    return data;
  }

}
module.exports = ServiceTypeService;
