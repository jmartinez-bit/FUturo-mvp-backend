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

//Obtener todos los registros para un servicio
 router.post("/get",async (req, res,next) =>{
  try{
    const cod_servicio=req.body.cod_servicio;
    const resources=await paymentService.get(cod_servicio);
    res.json(resources);
  }catch (e){
    next(e);
  }
});


//Actualizar pagos de servicios.
router.post("/update",async (req, res,next) =>{
  try{
    const cod_hito=req.body.cod_hito;
    const descripcion_hito=req.body.descripcion_hito||null;
    const horas=req.body.horas||null;
    const monto=req.body.monto||null;
    const fecha_inicio=req.body.fecha_inicio||null;
    const fecha_fin=req.body.fecha_fin||null;
    const resources=await paymentService.update(cod_hito,descripcion_hito,horas,monto,fecha_inicio,fecha_fin);
    res.json(resources);
  }catch (e){
    next(e);
  }
});

router.post("/delete",async (req, res,next) =>{
  try{
    const cod_hito=req.body.cod_hito;
    const resources=await paymentService.delete(cod_hito);
    res.json(resources);
  }catch (e){
    next(e);
  }
});

module.exports = router;
