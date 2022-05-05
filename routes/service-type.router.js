const express = require('express');
const ServiceTypeService = require('./../services/service-type.service');

const router = express.Router();
const serviceTypesService = new ServiceTypeService();

/**
 * @swagger
 * components:
 *  schemas:
 *    ServiceType:
 *      type: object
 *      properties:
 *        cod_tipo_servicio:
 *          type: string
 *          description: codigo del tipo de servicio
 *        nombre_tipo_servicio:
 *          type: string
 *          description: nombre del tipo de servicio
 *      required:
 *        - cod_tipo_servicio
 *        - nombre_tipo_servicio
 *      example:
 *        cod_tipo_servicio: INC
 *        nombre_tipo_servicio: incidencias
 */

// Buscar tipos de servicio por codigo de linea de servicio
/**
 * @swagger
 * /api/v1/service-type/service-line/{codLineaServicio}:
 *  get:
 *    summary: Buscar tipos de servicio por linea de servicio
 *    tags: [Tipo de servicio]
 *    parameters:
 *      - in: path
 *        name: codLineaServicio
 *        schema:
 *          type: string
 *        required: true
 *        description: codigo de la linea de servicio
 *    responses:
 *      200:
 *        description: lista de tipos de servicios
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ServiceType'
 */
router.get('/service-line/:codLineaServicio', async (req, res, next) => {
  try {
    const { codLineaServicio } = req.params;
    const serviceTypes = await serviceTypesService.findByCodLineaServicio(codLineaServicio);
    res.json(serviceTypes);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
