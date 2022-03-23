const express = require("express");
const ResourcesService =require("./../services/resources.service");

const router=express.Router();
const service=new ResourcesService();

router.get("/:cliente/:periodo",async (req, res,next) =>{
  try{
    const {cliente,periodo}=req.params;
    const resources=await service.findByClientAndPeriod(cliente,periodo);
    res.json(resources);
  }catch (e){
    next(e);
  }

});


module.exports = router;
