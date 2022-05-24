const express = require('express');
const RenovationRequestService = require('./../services/renovation-request.service');

const router = express.Router();
const renovationRequestService = new RenovationRequestService();

router.post('/create',
  async (req, res, next) => {
  try {
    const body = req.body;
    if(body.opcion_renovacion==="mismas condiciones"){
      const data=await renovationRequestService.modifyDataInput(body);
      const existASolicitude= await renovationRequestService.isThereAPreviousSolicitude(data.cod_colaborador);
      if(existASolicitude.length===0){
        if(data.fecha_fin_nuevo<data.fecha_inicio_nuevo){
          res.status(409).json({"error":true,
          "message":"La fecha de fin del nuevo contrato debe ser mayor la fecha de inicio"});
        }else{
          res.status(201).json(await renovationRequestService.create(data));
        }
      }else{
        res.status(409).json({"error":true,
          "message":"Existe una solicitud de renovación pendiente con este colaborador"});
      }
    }else{
        res.status(409).json({"error":true,
        "message":"Opcion de renovacion equivocada. La opcion: '"+body.opcion_renovacion+ "' no está implementada"});
    }

  } catch (error) {
    next(error);
  }
});

router.get('/auto/:cod_mapa_recurso',
  async (req, res, next) => {
  try {
    const {cod_mapa_recurso} = req.params;
    res.status(201).json(await renovationRequestService.fillDataAutocompleted(cod_mapa_recurso));
  } catch (error) {
    next(error);
  }
});

router.get("/getRenovation/:cod_solicitud_renovacion",async (req, res,next) =>{
  try{
    const {cod_solicitud_renovacion}=req.params;
    res.status(201).json(await renovationRequestService.findOneSolicitude(cod_solicitud_renovacion));
  }catch (e){
    next(e);
  }
});

router.get("/reject/:cod",async (req, res,next) =>{
  try{
    const {cod}=req.params;
    const estado=await renovationRequestService.findState(cod);
    if(estado==="Aprobado"||estado==="Rechazado"){
      res.status(409).json({"error":false,
      "message":"A esta solicitud ya se le asigno el estado "+estado});
    }else{
      await renovationRequestService.reject(cod,req.body);
      res.status(200).json({"error":false,
                          "message":"Se cambió el estado a Rechazado"});
    }
  }catch (e){
    next(e);
  }

});

<<<<<<< HEAD
// router.get("/approve",async (req, res,next) =>{
//   try{
//     const cod_usuario = req.user.id_sesion;
//     const {cod,indAsignFamiliar}=req.params;
//     const estado=await renovationRequestService.findState(cod);
//     if(estado==="Aprobado"||estado==="Rechazado"){
//       res.status(409).json({"error":false,
//       "message":"A esta solicitud ya se le asigno el estado "+estado});
//     }else if(estado==="Pendiente Aprobacion GG"){
//       res.status(409).json({"error":false,
//       "message":"Necesita aprobación del Gerente General "});
//     }else{
//       await renovationRequestService.approve(cod,indAsignFamiliar,cod_usuario);
//       res.status(200).json({"error":false,
//                           "message":"Se cambió el estado a Aprobado y se creo un nuevo contrato"});
//     }

//   }catch (e){
//     next(e);
//   }

// });

=======
>>>>>>> f037a9cbb3ce20429f14d9ee4f2dedc02fdd8aad
module.exports = router;
