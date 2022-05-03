const express = require('express');

const UserService = require('./../services/user.service');


const router = express.Router();
const service = new UserService();

// router.post('/creat',
//   validatorHandler(createServiceSchema, 'body'),
//   async (req, res, next) => {
//     try {
//       const body = req.body;
//       res.status(201).json(await service.create(body));
//     } catch (error) {
//       next(error);
//     }
//   }
// );

router.post("/create",async (req, res,next) =>{
    try{
      const body = req.body;
      const resources=await service.create(body);
      res.json(resources);
    }catch (e){
      next(e);
    }
  });

module.exports = router;