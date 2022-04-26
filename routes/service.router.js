const express = require('express');
const ServicesService = require('./../services/services.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { createServiceSchema, updateServiceSchema } = require('./../schemas/service.schema');


const router = express.Router();
const service = new ServicesService();

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateService:
 *      type: object
 *      properties:
 *        cod_cliente:
 *          type: integer
 *          description: codigo del cliente
 *        cod_linea_servicio:
 *          type: string
 *          description: codigo de linea de servicio
 *        tipo_servicio:
 *          type: string
 *          description: codigo del tipo de servicio
 *        descripcion_servicio:
 *          type: string
 *          description: nombre del servicio
 *        horas_venta:
 *          type: integer
 *          description: numero de horas de realizadas
 *        moneda:
 *          type: string
 *          description: tipo de moneda
 *        tasa_cambio:
 *          type: number
 *          description: tasa de cambio
 *        costo_venta:
 *          type: number
 *          description: costo de venta
 *        costo_venta_sol:
 *          type: number
 *          description: costo de venta en soles
 *        valor_venta:
 *          type: number
 *          description: valor de la venta
 *        valor_venta_sol:
 *          type: number
 *          description: valor de la venta en soles
 *        tarifa:
 *          type: number
 *          description: valor de la venta en dolares
 *        fecha_ini_planificada:
 *          type: string
 *          description: fecha de inicio
 *        fecha_fin_planificada:
 *          type: string
 *          description: fecha fin
 *        fecha_ini_real:
 *          type: string
 *          description: fecha de inicio real
 *        fecha_fin_real:
 *          type: string
 *          description: fecha fin real
 *        forma_pago:
 *          type: string
 *          description: forma de pago del servicio
 *      required:
 *        - cod_cliente
 *        - cod_linea_servicio
 *        - tipo_servicio
 *        - descripcion_servicio
 *        - horas_venta
 *        - moneda
 *        - tasa_cambio
 *        - costo_venta
 *        - valor_venta
 *        - costo_venta_sol
 *        - valor_venta_sol
 *        - tarifa
 *        - fecha_ini_planificada
 *        - fecha_fin_planificada
 *        - forma_pago
 *      example:
 *        cod_cliente: 1
 *        cod_linea_servicio: swf
 *        tipo_servicio: rq
 *        descripcion_servicio: nuevo servicio
 *        horas_venta: 30
 *        moneda: SOL
 *        tasa_cambio: 3.77
 *        costo_venta: 30.00
 *        costo_venta_sol: 30.00
 *        valor_venta: 40.80
 *        valor_venta_sol: 40.80
 *        tarifa: 20.00
 *        fecha_ini_planificada: 2022-04-19
 *        fecha_fin_planificada: 2022-05-15
 *        fecha_ini_real: 2022-04-19
 *        fecha_fin_real: 2022-05-15
 *        forma_pago: consumo
 */

// Crear un servicio
/**
 * @swagger
 * /api/v1/services/create:
 *  post:
 *    summary: registrar un nuevo servicio
 *    tags: [Servicio]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateService'
 *    responses:
 *      201:
 *        description: nuevo servicio creado
 */
router.post('/create',
  validatorHandler(createServiceSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      res.status(201).json(await service.create(body));
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar servicio
/**
 * @swagger
 * /api/v1/services/update/{codServicio}:
 *  post:
 *    summary: actualizar un servicio
 *    tags: [Servicio]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateService'
 *    responses:
 *      201:
 *        description: servicio actualizado
 */
router.post('/update/:codServicio',
  validatorHandler(updateServiceSchema, 'body'),
  async (req, res, next) => {
    try {
      const { codServicio } = req.params;
      const body = req.body;
      res.json(await service.update(codServicio, body));
    } catch (error) {
      next(error);
    }
  }
);

router.post("/cartera",async (req, res,next) =>{
  try{
    const cod_dm=req.body.cod_dm;
    const resources=await service.cartera(cod_dm);
    res.json(resources);
  }catch (e){
    next(e);
  }
});

//Obtener los servicios de un DM.
router.post("/get",async (req, res,next) =>{
  try{
    const cod_cliente=req.body.cod_cliente;
    const cod_linea_negocio=req.body.cod_linea_negocio||null;
    const estado=req.body.estado||null;
    const resources=await service.get(cod_cliente,cod_linea_negocio,estado);
    res.json(resources);
  }catch (e){
    next(e);
  }
});

module.exports = router;
