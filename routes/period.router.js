const express = require('express');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles  }  = require('./../middlewares/auth.handler');
const { createPeriodSchema, updatePeriodSchema } = require('../schemas/period.schema');
const PeriodService = require('./../services/period.service');

const router = express.Router();
const periodService = new PeriodService();

/**
 * @swagger
 * components:
 *  schemas:
 *    LastPeriod:
 *      type: object
 *      properties:
 *        periodo:
 *          type: string
 *          description: periodo mensual actual (mm-yyyy)
 *        tasa_cambio:
 *          type: string
 *          description: tasa de cambio actual
 *      required:
 *        - periodo
 *        - tasa_cambio
 *      example:
 *        periodo: 04-2022
 *        tasa_cambio: 3.77
 *    GetPeriods:
 *      type: object
 *      properties:
 *        periodo:
 *          type: string
 *          description: periodo mensual actual (mm-yyyy)
 *        tasa_cambio:
 *          type: string
 *          description: tasa de cambio actual
 *        fecha_apertura:
 *          type: date
 *          description: fecha de registro del periodo
 *        estado:
 *          type: string
 *          description: estado del periodo
 *      required:
 *        - periodo
 *        - tasa_cambio
 *        - fecha_apertura
 *        - estado
 *      example:
 *        periodo: 04-2022
 *        tasa_cambio: 3.77
 *        fecha_apertura: 15-04-2022
 *        estado: A
 *    UpdatePeriod:
 *      type: object
 *      properties:
 *        tasa_cambio:
 *          type: string
 *          description: tasa de cambio actual
 *      required:
 *        - tasa_cambio
 *      example:
 *        tasa_cambio: 3.77
 */

// Buscar ultimo periodo.
/**
 * @swagger
 * /api/v1/period/last-period:
 *  get:
 *    summary: Buscar tipos de servicio por linea de servicio
 *    tags: [Periodo]
 *    responses:
 *      200:
 *        description: obtener ultimo periodo con tasa de cambio
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/LastPeriod'
 */
router.get('/last-period', async (_req, res, next) => {
  try {
    const lastPeriod = await periodService.getLastPeriod();
    res.json(lastPeriod);
  } catch (error) {
    next(error);
  }
});

// Aperturar periodo.
/**
 * @swagger
 * /api/v1/period/create:
 *  post:
 *    summary: registrar un nuevo periodo
 *    tags: [Periodo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/LastPeriod'
 *    responses:
 *      201:
 *        description: nuevo periodo creado
 *      409:
 *        description: hubo conflictos al momento de crear
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Unauthorized'
 */
router.post('/create',
  checkRoles('JEFE_DE_RECURSOS_HUMANOS', 'ANALISTA_RECURSOS_HUMANOS'),
  validatorHandler(createPeriodSchema, 'body'),
  async (req, res, next) => {
  try {
    const body = req.body;
    res.status(201).json(await periodService.create(body));
  } catch (error) {
    next(error);
  }
});

// Actualizar ultimo periodo.
/**
 * @swagger
 * /api/v1/period/update:
 *  put:
 *    summary: actualizar ultimo periodo
 *    tags: [Periodo]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/UpdatePeriod'
 *    responses:
 *      200:
 *        description: periodo actualizado
 */
router.put('/update',
  checkRoles('JEFE_DE_RECURSOS_HUMANOS', 'ANALISTA_RECURSOS_HUMANOS'),
  validatorHandler(updatePeriodSchema, 'body'),
  async (req, res, next) => {
  try {
    const body = req.body;
    res.json(await periodService.update(body));
  } catch (error) {
    next(error);
  }
});

// Obtener los ultimos 6 periodos.
/**
 * @swagger
 * /api/v1/period:
 *  get:
 *    summary: listar ultimos 6 periodos
 *    tags: [Periodo]
 *    responses:
 *      200:
 *        description: Listado de periodos
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/GetPeriods'
 */
router.get('/',
  checkRoles('JEFE_DE_RECURSOS_HUMANOS', 'ANALISTA_RECURSOS_HUMANOS'),
  async (_req, res, next) => {
  try {
    res.json(await periodService.getAll());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
