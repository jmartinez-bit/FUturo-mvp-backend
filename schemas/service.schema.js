const Joi = require('joi');

const codServicio = Joi.number().integer();
const cod_cliente = Joi.number().integer();
const cod_linea_servicio = Joi.string();
const tipo_servicio = Joi.string();
const descripcion_servicio = Joi.string();
const horas_venta = Joi.number().integer();
const moneda = Joi.string();
const tasa_cambio = Joi.number().precision(2);
const costo_venta = Joi.number().precision(2);
const costo_venta_sol = Joi.number().precision(2);
const valor_venta = Joi.number().precision(2);
const valor_venta_sol = Joi.number().precision(2);
const prod_venta = Joi.number().precision(2);
const tarifa = Joi.number().precision(2);
const fecha_ini_planificada = Joi.date();
const fecha_fin_planificada = Joi.date().greater(Joi.ref('fecha_ini_planificada'));
const fecha_ini_real = Joi.date();
const fecha_fin_real = Joi.date().greater(Joi.ref('fecha_ini_real'));
const forma_pago = Joi.string();
const etapa = Joi.string();
const estado = Joi.string();
const estado_servicio = Joi.string();

const createServiceSchema = Joi.object({
  cod_cliente: cod_cliente.required(),
  cod_linea_servicio: cod_linea_servicio.required(),
  tipo_servicio: tipo_servicio.required(),
  descripcion_servicio: descripcion_servicio.required(),
  horas_venta: horas_venta.required(),
  moneda: moneda.required(),
  tasa_cambio: tasa_cambio.required(),
  costo_venta: costo_venta.allow(null),
  costo_venta_sol: costo_venta_sol.allow(null),
  valor_venta: valor_venta.required(),
  valor_venta_sol: valor_venta_sol.required(),
  prod_venta: prod_venta.allow(null),
  tarifa: tarifa.required(),
  fecha_ini_planificada: fecha_ini_planificada.required(),
  fecha_fin_planificada: fecha_fin_planificada.required(),
  fecha_ini_real: fecha_ini_real.allow(null),
  fecha_fin_real: fecha_fin_real.allow(null),
  forma_pago: forma_pago.required(),
  etapa: etapa.allow(null),
  estado: estado.allow(null)
});

const updateServiceSchema = Joi.object({
  cod_cliente: cod_cliente.required(),
  cod_linea_servicio: cod_linea_servicio.required(),
  tipo_servicio: tipo_servicio.required(),
  descripcion_servicio: descripcion_servicio.required(),
  horas_venta: horas_venta.required(),
  moneda: moneda.required(),
  tasa_cambio: tasa_cambio.required(),
  costo_venta: costo_venta.allow(null),
  costo_venta_sol: costo_venta_sol.allow(null),
  valor_venta: valor_venta.required(),
  valor_venta_sol: valor_venta_sol.required(),
  prod_venta: prod_venta.allow(null),
  tarifa: tarifa.required(),
  fecha_ini_planificada: fecha_ini_planificada.required(),
  fecha_fin_planificada: fecha_fin_planificada.required(),
  fecha_ini_real: fecha_ini_real.allow(null),
  fecha_fin_real: fecha_fin_real.allow(null),
  forma_pago: forma_pago.required(),
  etapa: etapa.allow(null),
  estado: estado.allow(null)
});

const getServiceSchema = Joi.object({
  codServicio: codServicio.required(),
});

module.exports = { createServiceSchema, updateServiceSchema, getServiceSchema }
