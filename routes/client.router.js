const express = require('express');
const ClientService = require('./../services/client.service');
const { checkApiKey, checkRoles } = require('../middlewares/auth.handler');

const router = express.Router();
const clientService = new ClientService();

/**
 * @swagger
 * components:
 *  schemas:
 *    Unauthorized:
 *      type: object
 *      properties:
 *        statusCode:
 *          type: integer
 *          description: estado de la respuesta
 *        error:
 *          type: string
 *          description: error
 *        message:
 *          type: string
 *          description: mensaje de error
 *    Client:
 *      type: object
 *      properties:
 *        nombre_corto:
 *          type: string
 *          description: nombre corto del cliente
 *        cod_cliente:
 *          type: integer
 *          description: codigo del cliente
 *      required:
 *        - nombre_corto
 *        - cod_cliente
 *      example:
 *        nombre_corto: Yotz
 *        cod_cliente: 6
 */

// Obtener todos los clientes asignados a un dm
/**
 * @swagger
 * /api/v1/clients/user:
 *  get:
 *    summary: Obtener clientes de un dm
 *    tags: [Cliente]
 *    parameters:
 *      - in: header
 *        name: api
 *        schema:
 *          type: integer
 *        required: true
 *        description: codigo de usuario con inicio de sesión (3)
 *    responses:
 *      200:
 *        description: lista de clientes asignados
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Client'
 *      401:
 *        description: Acceso no autorizado
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Unauthorized'
 */
router.get('/user',
  async (req, res, next) => {
  try {
    const {authorization}=req.headers;
    const auth=JSON.parse(authorization);
    const codUsuario=auth.id_sesion;

    const serviceLines = await clientService.findClientsJoinCarteraClienteByCodUsuario(codUsuario);
    res.json(serviceLines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
