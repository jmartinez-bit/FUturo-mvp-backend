const express = require('express');
const ContractService = require('../services/contract.service');

const router = express.Router();
const contractService = new ContractService();

router.get("/isThereAContractActive/:nroDocumento",async (req, res,next) =>{
  try{
    const {nroDocumento}=req.params;
    const data=await contractService.isThereAContractActive(nroDocumento);
    res.json(data);

  }catch (e){
    next(e);
  }

});

module.exports = router;
