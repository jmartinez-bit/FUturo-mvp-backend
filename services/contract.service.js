const sequelize = require('../libs/sequelize');

class ContractService{

  async isThereAContractActive(nroDocumento){
    const query=`SELECT TRUE
                WHERE EXISTS (SELECT 1
                              FROM contrato
                              INNER JOIN colaborador ON contrato.cod_colaborador=colaborador.cod_colaborador
                              WHERE nro_documento = '${nroDocumento}' AND CURRENT_DATE<=fecha_fin
                              AND (contrato.estado='AC' OR contrato.estado='RE') ); `;
    const [data] = await sequelize.query(query);
     return data;
  }

}

module.exports = ContractService;
