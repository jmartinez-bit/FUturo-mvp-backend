const express = require('express');
const PaymentMethodService = require('./../services/payment-method.service');

const router = express.Router();
const paymentMethodService = new PaymentMethodService();

/**
 * @swagger
 * components:
 *  schemas:
 *    PaymentMethod:
 *      type: object
 *      properties:
 *        forma_pago:
 *          type: string
 *          description: nombre de la forma de pago
 *      required:
 *        - forma_pago
 *      example:
 *        forma_pago: mensual
 */

// Buscar formas de pago por codigo de tipo de servicio
/**
 * @swagger
 * /api/v1/payment-method/{codTipoServicio}:
 *  get:
 *    summary: Buscar formas de pago por tipo de servicio
 *    tags: [Forma de pago]
 *    parameters:
 *      - in: path
 *        name: codTipoServicio
 *        schema:
 *          type: string
 *        required: true
 *        description: codigo del tipo de servicio
 *    responses:
 *      200:
 *        description: lista de formas de pago
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/PaymentMethod'
 */
router.get('/:codTipoServicio', async (req, res, next) => {
  try {
    const { codTipoServicio } = req.params;
    const paymentMethods = await paymentMethodService.findByCodTipoServicio(codTipoServicio);
    res.json(paymentMethods);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
