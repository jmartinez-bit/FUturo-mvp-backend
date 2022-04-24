const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM pagos_servicios`;
};

function getInsert(attributes = '*') {
  return `INSERT INTO pagos_servicios(${ attributes.toString() })`;
};

class PaymentServicesService{

  async create(data) {
    // Columnas
    const insert = getInsert(['cod_servicio', 'numero_hito', 'descripcion_hito', 'horas', 'monto',
                              'fecha_inicio', 'fecha_fin']);

    const query = `${ insert } VALUES(?, ?, ?, ?, ?, ?, ?) RETURNING *;`;
    const [[ newPayment ]] = await sequelize.query(query, {
      type: QueryTypes.INSERT,
      replacements: [data.cod_servicio, (await this.countHitos(data.cod_servicio) + 1).toString(),
                     data.descripcion_hito, data.horas, data.monto,
                     data.fecha_inicio, data.fecha_fin]
    });

    return newPayment;
  }

  async countHitos(codServicio) {

    const select = getSelect(['count(*)']);

    const query = `${ select } WHERE cod_servicio = ${ codServicio };`;
    const [[data]] = await sequelize.query(query);

    return parseInt(data.count);
  }

}
module.exports = PaymentServicesService;
