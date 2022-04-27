const sequelize = require('../libs/sequelize');
const EpsService = require('../services/eps.service');

const epsService = new EpsService();

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
    //Acondicionamiento ind_eps
    var indEps='N';
    if(d.cod_eps!=null){
      indEps='S';
    }
    //Acondicionamiento ind_sctr
    if(d.ind_sctr===null){
    var indSctr='N';
    }else{
      indSctr="'"+d.ind_sctr+"'";
    }
    //Acondicionamiento ind_asign_familiar
    if(d.ind_asign_familiar===null){
      var indAsignFamiliar='N';
      }else{
        indAsignFamiliar="'"+d.ind_asign_familiar+"'";
      }
    //Acondicionamiento ind_asign_familiar
    if(d.ind_asign_familiar==='S'){
      var asignFamiliar="'"+ process.env.ASIGN_FAMILIAR +"'"   ;
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
    //Acondicionamiento eps
    var eps=null;
    if(d.cod_eps!=null){
       eps=await epsService.findAmount(d.cod_eps,d.eps_parcial_total);
       eps="'"+eps+"'";
    }
    //Acondicionamiento sctr
    var sctr=null;
    if(d.ind_sctr==='s'||d.ind_sctr==='S'){
      sctr=process.env.PORCENTAJE_SCTR*d.remuneracion;
      sctr="'"+sctr+"'";
    }
    //Acondicionamiento bono
    var bono=null;
    if(d.bono_men!=null){
      bono="'"+d.bono_men+"'";
    }
    //Insert
    const query=`INSERT INTO contrato(
      cod_colaborador,tipo, modalidad, ind_eps, ind_sctr,ind_asign_familiar,asignacion_familiar, sueldo_planilla, rxh, bono, eps, sctr, clm, fecha_inicio, fecha_fin,estado,fecha_reg,usuario_registro)
      VALUES (${id},'C','${d.modalidad}', '${indEps}', ${indSctr},${indAsignFamiliar},${asignFamiliar}, ${sueldoPlanilla},${rxh}, ${bono}, ${eps}, ${sctr}, '${d.clm}', '${d.fecha_inicio}','${d.fecha_fin}','AC',CURRENT_DATE,'${usuarioReg}');`;
    await sequelize.query(query);
  }


}

module.exports = ContractService;
