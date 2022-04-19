const express = require('express');
const PaymentServicesService = require('./../services/payment-services.service');

const router = express.Router();
const paymentService = new PaymentServicesService();

/**
 * @swagger
 * components:
 *  schemas:
 *    CreatePaymentService:
 *      type: object
 *      properties:
 *        cod_servicio:
 *          type: integer
 *          description: codigo del cliente
 *        descripcion_hito:
 *          type: string
 *          description: descripcion del hito
 *        horas:
 *          type: integer
 *          description: numero de horas realizadas
 *        monto:
 *          type: number
 *          description: monto del pago
 *        fecha_inicio:
 *          type: string
 *          description: fecha de inicio del hito
 *        fecha_fin:
 *          type: string
 *          description: fecha fin del hito
 *      required:
 *        - cod_servicio
 *        - descripcion_hito
 *        - horas
 *        - monto
 *      example:
 *        cod_servicio: 3
 *        descripcion_hito: nueva desc
 *        horas: 80
 *        monto: 2500.50
 *        fecha_inicio: 2022-04-19
 *        fecha_fin: 2022-05-15
 */

// Crear un hito
/**
 * @swagger
 * /api/v1/payment-service/create:
 *  post:
 *    summary: registrar un hito
 *    tags: [Pago Servicio]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreatePaymentService'
 *    responses:
 *      201:
 *        description: nuevo hito creado
 */
router.post('/create', async (req, res, next) => {
  try {
    const body = req.body;
    res.status(201).json(await paymentService.create(body));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
