<<<<<<< HEAD
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

const paymentService = new PaymentServicesService();

class ServicesService{

  async create(data) {

    // Columnas
    const insert = getInsert(['cod_cliente', 'cod_linea_servicio', 'tipo_servicio', 'descripcion_servicio',
              'horas_venta', 'moneda', 'tasa_cambio', 'costo_venta',
              'costo_venta_sol', 'valor_venta', 'valor_venta_sol', 'tarifa',
              'fecha_ini_planificada', 'fecha_fin_planificada', 'fecha_ini_real', 'fecha_fin_real',
              'forma_pago', 'usuario_reg', 'estado']);

    const query = `${ insert } VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;`;
    const [[newService]] = await sequelize.query(query, {
      type: QueryTypes.INSERT,
      replacements: [data.cod_cliente,
        data.cod_linea_servicio,
        data.tipo_servicio,
        data.descripcion_servicio,
        data.horas_venta,
        data.moneda,
        data.tasa_cambio,
        data.costo_venta,
        data.costo_venta_sol,
        data.valor_venta,
        data.valor_venta_sol,
        data.tarifa,
        data.fecha_ini_planificada,
        data.fecha_fin_planificada,
        data.fecha_ini_real,
        data.fecha_fin_real,
        data.forma_pago,
        'prueba', 'en proceso']
    });

    let newPayment = null;
    if (newService.forma_pago === 'total' || newService.forma_pago === 'consumo') {
      newPayment = await paymentService.create({
        cod_servicio: newService.cod_servicio,
        descripcion_hito: newService.descripcion_servicio,
        horas: newService.horas_venta,
        monto: newService.forma_pago === 'total' ? newService.valor_venta : 0,
        fecha_inicio: newService.fecha_ini_planificada,
        fecha_fin: newService.fecha_fin_planificada
      });
    }

    newService.newPayment = newPayment;

    return newService;

  }

}
module.exports = ServicesService;
||||||| e7c67dc
=======
const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM servicio`;
};

function getInsert(attributes = '*') {
  return `INSERT INTO servicio(${ attributes.toString() })`;
};

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

  async cartera(cod_dm){
    let query = "SELECT a.cod_cliente, b.nombre_corto " +
    "FROM cartera_clientes a " +
    "INNER JOIN cliente b ON a.cod_cliente = b.cod_cliente " +
    "WHERE cod_usuario = " + cod_dm + ";"
    const [rta] = await sequelize.query(query);
    return rta;
  }

  async get(cod_cliente,cod_linea_negocio,estado){

    let query = "SELECT a.cod_servicio, b.nombre_corto, tipo_servicio, etapa, estado, horas_venta, "+
    "valor_venta, fecha_ini_planificada, fecha_fin_planificada, fecha_ini_real, "+
    "fecha_fin_real, horas_planificadas, valor_venta_planificada, horas_ejecutadas, "+
    "horas_produccion_ejecutadas "+
    "FROM servicio a"
    "INNER JOIN cliente b ON a.cod_cliente = b.cod_cliente " +
    "WHERE estado = " + estado + ";"

    if(cod_linea_negocio != "Todos"){
      query += "AND cod_linea_negocio = " + cod_linea_negocio
    }
    if(cod_cliente != "Todos"){
      query += "AND cod_cliente = " + cod_cliente
    }
    const [rta] = await sequelize.query(query);
    return rta;
  }


}
module.exports = ServicesService;
>>>>>>> 0ce1614937e107d428ebf209a30f183190354ed5
