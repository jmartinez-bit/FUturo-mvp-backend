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

  async createContractfromSolicitude(d,id,usuarioReg){
    var indAsignFamiliar;
    var asignFamiliar;
    //Acondicionamiento ind_asign_familiar
    if(d.ind_asign_familiar===null){
        indAsignFamiliar='N';
      }else{
        indAsignFamiliar="'"+d.ind_asign_familiar+"'";
      }
    //Acondicionamiento asign_familiar
    if(d.ind_asign_familiar==='S'){
        asignFamiliar="'"+ process.env.ASIGN_FAMILIAR +"'"   ;
      }else{
        asignFamiliar=null;
      }
    //Acondicionamiento sueldo_planilla
    var sueldoPlanilla=null;
    var rxh="'"+d.remuneracion+"'";
    if(d.modalidad.toLowerCase()==='planilla'){
      sueldoPlanilla="'"+d.remuneracion+"'";
      rxh=null;
    }

    //Acondicionamiento bono
    var bono=null;
    if(d.bono_men!=null){
      bono="'"+d.bono_men+"'";
    }
    //Insert
    const query=`INSERT INTO contrato(
      cod_colaborador,tipo, modalidad,ind_asign_familiar,asignacion_familiar, sueldo_planilla, rxh, bono, clm, fecha_inicio, fecha_fin,estado,fecha_reg,usuario_registro)
      VALUES (${id},'C','${d.modalidad}',${indAsignFamiliar},${asignFamiliar}, ${sueldoPlanilla},${rxh}, ${bono}, '${d.clm}', '${d.fecha_inicio}','${d.fecha_fin}','AC',CURRENT_DATE,'${usuarioReg}');`;
    await sequelize.query(query);
  }


}

module.exports = ContractService;
