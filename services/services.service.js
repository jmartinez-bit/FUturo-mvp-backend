const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');
const PaymentServicesService = require('./payment-services.service');
const AssignmentsService = require('./assignments.service');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM servicio`;
};

function getInsert(attributes = '*') {
  return `INSERT INTO servicio(${ attributes.toString() })`;
};

const paymentService = new PaymentServicesService();
const assignmentsService = new AssignmentsService();

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

  async update(codServicio, data) {

    const query = `UPDATE servicio
    SET cod_cliente = ?,
    cod_linea_servicio = ?,
    tipo_servicio = ?,
    descripcion_servicio = ?,
    horas_venta = ?,
    moneda = ?,
    tasa_cambio = ?,
    costo_venta = ?,
    costo_venta_sol = ?,
    valor_venta = ?,
    valor_venta_sol = ?,
    tarifa = ?,
    fecha_ini_planificada = ?,
    fecha_fin_planificada = ?,
    fecha_ini_real = ?,
    fecha_fin_real = ?,
    fecha_act = ?,
    forma_pago = ?
    WHERE cod_servicio = ${ codServicio } RETURNING *;`;

    const [[updateService]] = await sequelize.query(query, {
      replacements: [data.cod_cliente,
                    data.cod_linea_servicio,
                    data.tipo_servicio,
                    data.descripcion_servicio.toLowerCase(),
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
                    new Date().toISOString().split('T')[0],
                    data.forma_pago,
                    codServicio],
      type: sequelize.QueryTypes.UPDATE
    });

    return updateService;

  }

  async findOneByCodServicio(codServicio) {
    // Columnas
    const select = getSelect(['servicio.cod_servicio',
                              'servicio.cod_cliente',
                              'servicio.cod_linea_servicio',
                              'servicio.tipo_servicio',
                              'servicio.descripcion_servicio',
                              'servicio.horas_venta',
                              'servicio.moneda',
                              'servicio.tasa_cambio',
                              'servicio.costo_venta',
                              'servicio.costo_venta_sol',
                              'servicio.valor_venta',
                              'servicio.valor_venta_sol',
                              'servicio.tarifa',
                              'servicio.fecha_ini_planificada',
                              'servicio.fecha_fin_planificada',
                              'servicio.fecha_ini_real',
                              'servicio.fecha_fin_real',
                              'servicio.forma_pago',
                              'servicio.usuario_reg',
                              'servicio.estado',
                            ]);

    const query=`${ select }
                WHERE servicio.cod_servicio = ${ codServicio };`;
    const [data] = await sequelize.query(query);
    return data;
  }

  async getServicePaymentServiceAndAssignments(codServicio) {

    const service = await this.findOneByCodServicio(codServicio);

    const data = {
      ...service[0],
      pagos_servicios: await paymentService.findOneByCodServicio(codServicio),
      asignaciones: await assignmentsService.findOneByCodServicioJoinColaborador(codServicio)
    };

    return data;
  }

}
module.exports = ServicesService;
