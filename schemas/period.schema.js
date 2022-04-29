const Joi = require('joi');

const periodo = Joi.string();
const tasa_cambio = Joi.number().precision(2);

const createPeriodSchema = Joi.object({
  periodo: periodo.required(),
  tasa_cambio: tasa_cambio.required(),
});

const updatePeriodSchema = Joi.object({
  tasa_cambio: tasa_cambio.required(),
});

const getPeriodSchema = Joi.object({
  periodo: periodo.required(),
});

module.exports = { createPeriodSchema, updatePeriodSchema, getPeriodSchema }
