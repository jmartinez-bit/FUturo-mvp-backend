const Joi = require('joi');

const cod_cliente = Joi.number().integer();
const cod_linea_servicio = Joi.number().integer();
const tipo_servicio = Joi.string();
const descripcion_servicio = Joi.string();
const horas_venta = Joi.number().integer();
const moneda = Joi.string();
const valor_venta = Joi.number().precision(2);
const fecha_ini_planificada = Joi.date();
const fecha_fin_planificada = Joi.date().greater(Joi.ref('fecha_ini_planificada'));
const fecha_ini_real = Joi.date();
const fecha_fin_real = Joi.date().greater(Joi.ref('fecha_ini_real'));
const forma_pago = Joi.string();
const estado = Joi.string();

const createServiceSchema = Joi.object({
  cod_cliente: cod_cliente.required(),
  cod_linea_servicio: cod_linea_servicio.required(),
  tipo_servicio: tipo_servicio.required(),
  descripcion_servicio: descripcion_servicio.required(),
  horas_venta: horas_venta.required(),
  moneda: moneda.required(),
  valor_venta: valor_venta.required(),
  fecha_ini_planificada: fecha_ini_planificada.required(),
  fecha_fin_planificada: fecha_fin_planificada.required(),
  fecha_ini_real: fecha_ini_real.allow(null),
  fecha_fin_real: fecha_fin_real.allow(null),
  forma_pago: forma_pago.required(),
  estado: estado.required()
});

module.exports = { createServiceSchema }
