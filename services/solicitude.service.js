const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

const ContractSolicitudeService = require('../services/contractSolicitude.service');
const RenovationRequestService = require('../services/renovation-request.service');

const contractSolicitudeService = new ContractSolicitudeService();
const renovationRequestService = new RenovationRequestService();

class SolicitudeService{

  async findBy(body){
    var query;
    var data;
    switch (body.tipo_solicitud) {
      case "contratacion":
        query=contractSolicitudeService.findBy(body);
        query+=`ORDER BY fecha_reg DESC ;`;
        [data] = await sequelize.query(query);
        break;
      case "renovacion":
        query=renovationRequestService.findBy(body);
        query+=`ORDER BY fecha_reg DESC ;`;
        [data] = await sequelize.query(query);
        break;
      default:
        query=contractSolicitudeService.findBy(body)+
        " UNION "+renovationRequestService.findBy(body);  //unir cada vez que se agregue un tipo de solicitud
        query+=`ORDER BY fecha_reg DESC ;`;
        [data] = await sequelize.query(query);
        break;
    }

     return data;
  }

  async findOne(cod,tipo){
    var query;
    var data;
    switch (tipo) {
      case "contratacion":
        query=contractSolicitudeService.findOne();
        [data] = await sequelize.query(query,{
          type: QueryTypes.SELECT,
          replacements: [cod]
        });
        break;
      case "renovacion":
        query=renovationRequestService.findOne();
        [data] = await sequelize.query(query,{
          type: QueryTypes.SELECT,
          replacements: [cod]
        });
          break;
      default:
        data={"error":true,"message":"No existe servicio para este tipo de movimiento de recurso"};
        break;
    }

     return data;
  }
}

module.exports = SolicitudeService;
