const express = require('express');
const ClientService = require('./../services/client.service');

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

 router.get("/",async (req, res,next) =>{
  try{
    const data=await clientService.findAll();
    res.json(data);

  }catch (e){
    next(e);
  }

});

// Obtener todos los clientes asignados a un dm
/**
 * @swagger
 * /api/v1/clients/user:
 *  get:
 *    summary: Obtener clientes de un dm
 *    tags: [Cliente]
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
    const user = req.user;
    const serviceLines = await clientService.findClientsJoinCarteraClienteByCodUsuario(user.id_sesion);
    res.json(serviceLines);
  } catch (error) {
    next(error);
  }
});



module.exports = router;
