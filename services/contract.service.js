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

  async createContractfromSolicitude(d,id){
    //Acondicionamiento ind_eps
    var indEps='N';
    if(d.cod_eps!=null){
      indEps='S';
    }
    //Acondicionamiento ind_sctr
    var indSctr=null;
    if(d.ind_sctr!=null){
      indSctr=d.ind_sctr;
      indSctr="'"+indSctr+"'";
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
    if(d.bono!=null){
      bono="'"+d.bono+"'";
    }
    //Insert
    const query=`INSERT INTO contrato(
      cod_colaborador,tipo, modalidad, ind_eps, ind_sctr, sueldo_planilla, rxh, bono_men, eps, sctr, clm, fecha_inicio, fecha_fin,estado,fecha_reg)
      VALUES (${id},'C','${d.modalidad}', '${indEps}', ${indSctr}, ${sueldoPlanilla},${rxh}, ${bono}, ${eps}, ${sctr}, '${d.clm}', '${d.fecha_inicio}','${d.fecha_fin}','AC',CURRENT_DATE);`;
    await sequelize.query(query);
  }


}

module.exports = ContractService;
