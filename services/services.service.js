const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');
const PaymentServicesService = require('./payment-services.service');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM servicio`;
};

function getInsert(attributes = '*') {
  return `INSERT INTO servicio(${ attributes.toString() })`;
};

const paymentService  = new PaymentServicesService();

class ServicesService{

  async create(data) {

    // Columnas
    const insert = getInsert(['cod_cliente', 'cod_linea_servicio', 'tipo_servicio', 'descripcion_servicio',
    'horas_venta', 'moneda', 'valor_venta', 'fecha_ini_planificada',
    'fecha_fin_planificada', 'fecha_ini_real', 'fecha_fin_real', 'forma_pago',
    'usuario_reg', 'estado']);

    const query = `${ insert } VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;`;
    const [[newService]] = await sequelize.query(query, {
      type: QueryTypes.INSERT,
      replacements: [data.cod_cliente, data.cod_linea_servicio, data.tipo_servicio, data.descripcion_servicio,
              data.horas_venta, data.moneda, data.valor_venta, data.fecha_ini_planificada,
              data.fecha_fin_planificada, data.fecha_ini_real, data.fecha_fin_real, data.forma_pago,
              'prueba', data.estado]
    });

    return newService;

  }

}
module.exports = ServicesService;
