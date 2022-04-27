const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM pagos_servicios`;
};

const getInsert = (attributes = '*') => {
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

  async findOneByCodServicio(codServicio) {

    // Columnas
    const select = getSelect(['pagos_servicios.cod_servicio',
                              'pagos_servicios.numero_hito',
                              'pagos_servicios.descripcion_hito',
                              'pagos_servicios.horas',
                              'pagos_servicios.monto',
                              'pagos_servicios.fecha_inicio',
                              'pagos_servicios.fecha_fin'
                            ]);

    const query=`${ select }
                  WHERE pagos_servicios.cod_servicio=${ codServicio };`;
    const [data] = await sequelize.query(query);
    return data;

  }

}
module.exports = PaymentServicesService;
