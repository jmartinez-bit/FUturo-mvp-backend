const express = require('express');
const ServiceLineService = require('./../services/service-line.service');

const router = express.Router();
const serviceLine = new ServiceLineService();

/**
 * @swagger
 * components:
 *  schemas:
 *    ServiceLine:
 *      type: object
 *      properties:
 *        cod_linea_servicio:
 *          type: string
 *          description: codigo de la linea de servicio
 *        linea_servicio:
 *          type: string
 *          description: nombre de la linea de servicio
 *      required:
 *        - cod_linea_servicio
 *        - linea_servicio
 *      example:
 *        cod_linea_servicio: swf
 *        linea_servicio: software factory
 */

// Obtener todas las lineas de servicio
/**
 * @swagger
 * /api/v1/service-line/all:
 *  get:
 *    summary: Obtener todas las lineas de servicio
 *    tags: [Linea de Servicio]
 *    responses:
 *      200:
 *        description: todas las lineas de servicio
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ServiceLine'
 */
router.get('/all', async (_req, res, next) => {
  try {
    const serviceLines = await serviceLine.getAll();
    res.json(serviceLines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
