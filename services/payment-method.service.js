const sequelize = require('../libs/sequelize');

// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM forma_pago`;
};

class PaymentMethodService{

  async findByCodTipoServicio(codTipoServicio) {
    // Columnas
    const select = getSelect(['forma_pago']);

    // Sentencia
    const [data] = await sequelize.query(`${ select } WHERE cod_tipo_servicio='${ codTipoServicio }';`);

    return data;
  }

}
module.exports = PaymentMethodService;
