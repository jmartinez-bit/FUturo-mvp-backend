const sequelize = require('../libs/sequelize');
const ContractSolicitudeService = require('../services/contractSolicitude.service');

const contractSolicitudeService = new ContractSolicitudeService();

class SolicitudeService{

  async findBy(body){
    var query;
    switch (body.tipo_solicitud) {
      case "contratacion":
        query=contractSolicitudeService.findBy(body);
        break;
      case "renovacion":
        //query=renovationSolicitudeService.findBy(body);
          break;
      default:
        query=contractSolicitudeService.findBy(body)+" "//esto lo puse para que no me salten los subrayados molestos;
        //"UNION"+renovationSolicitudeService.findBy(body);  //unir cada vez que se agregue un tipo de solicitud
        break;
    }

    query+=`ORDER BY fecha_reg DESC ;`;
    const [data] = await sequelize.query(query);
     return data;
  }

}

module.exports = SolicitudeService;
