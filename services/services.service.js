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
