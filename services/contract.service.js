const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

class ContractService{

  async isThereAContractActive(nroDocumento){
    const query=`SELECT TRUE
                WHERE EXISTS (SELECT 1
                              FROM contrato
                              INNER JOIN colaborador ON contrato.cod_colaborador=colaborador.cod_colaborador
                              WHERE nro_documento = ? AND CURRENT_DATE<=fecha_fin
                              AND (contrato.estado='AC' OR contrato.estado='RE') ); `;

    return sequelize.query(query,{
      type: QueryTypes.SELECT,
      replacements: [nroDocumento]
    });
  }

  async createContractfromSolicitude(d,id,usuarioReg){
    var indAsignFamiliar;
    var asignFamiliar;
    //Acondicionamiento ind_asign_familiar
    if(d.ind_asign_familiar===null){
        indAsignFamiliar='N';
      }else{
        indAsignFamiliar=d.ind_asign_familiar;
      }
    //Acondicionamiento asign_familiar
    if(d.ind_asign_familiar==='S'){
        asignFamiliar=process.env.ASIGN_FAMILIAR;
      }else{
        asignFamiliar=null;
      }
    //Acondicionamiento sueldo_planilla
    var sueldoPlanilla=null;
    var rxh=d.remuneracion;
    if(d.modalidad.toLowerCase()==='planilla'){
      sueldoPlanilla=d.remuneracion;
      rxh=null;
    }

    //Insert
    const query=`INSERT INTO contrato(
      cod_colaborador,tipo, modalidad,ind_asign_familiar,asignacion_familiar, sueldo_planilla, rxh,
       bono, clm, fecha_inicio, fecha_fin,estado,fecha_reg,usuario_registro)
      VALUES (?,'C',?,?,?, ?,?, ?, ?, ?,?,'AC',CURRENT_DATE,?);`;
    await sequelize.query(query,
      {
      type: QueryTypes.INSERT,
      replacements: [id,d.modalidad,indAsignFamiliar,asignFamiliar,
      sueldoPlanilla,rxh,d.bono_men,d.clm,d.fecha_inicio,d.fecha_fin,usuarioReg]
      });
  }

}

module.exports = ContractService;
