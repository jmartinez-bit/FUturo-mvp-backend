const express = require('express');
const ClientService = require('../services/client.service');

const router = express.Router();
const clienteService = new ClientService();

router.get("/",async (req, res,next) =>{
  try{
    const data=await clienteService.findAll();
    res.json(data);

  }catch (e){
    next(e);
  }

});

module.exports = router;
