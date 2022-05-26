const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

const ParameterService = require('../services/parameter.service');
const PeriodService = require('../services/period.service');

const periodService = new PeriodService();
const parameterService = new ParameterService();

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
       bono, clm, fecha_inicio, fecha_fin,estado,fecha_reg,usuario_registro,empresa)
      VALUES (?,'C',?,?,?, ?,?, ?, ?, ?,?,'AC',CURRENT_DATE,?,?);`;
    await sequelize.query(query,
      {
      type: QueryTypes.INSERT,
      replacements: [id,d.modalidad,indAsignFamiliar,asignFamiliar,
      sueldoPlanilla,rxh,d.bono_men,d.clm,d.fecha_inicio,d.fecha_fin,usuarioReg,d.empresa]
      });
  }


  async renovationContractfromSolicitude(d,usuarioReg){
    const [[lastContract]]=await sequelize.query(`SELECT * from contrato WHERE cod_colaborador= ${d.cod_colaborador} order by fecha_reg desc limit 1`);

      if (!d.nueva_modalidad){
        d.modalidad = lastContract.modalidad;
      }
      if (!d.nuevo_sueldo){
        if(lastContract.modalidad==='planilla'){
          d.remuneracion = lastContract.sueldo_planilla
        } else {
          d.remuneracion = lastContract.rxh
        }
      }
      if (!d.nuevo_bono){
        d.modalidad_bono = lastContract.modalidad_bono;
        d.bono_men = lastContract.bono;
      }
      if (d.nuevo_puesto){
        const querypuesto=`UPDATE colaborador
                 SET cod_puesto = '${d.cod_puesto}'
                 WHERE cod_colaborador=${d.cod_colaborador}`;
        await sequelize.query(querypuesto);
      }
      if (d.nuevo_nivel_puesto){
        const querynivel=`UPDATE colaborador
                 SET nivel = '${d.nivel}'
                 WHERE cod_colaborador=${d.cod_colaborador}`;
        await sequelize.query(querynivel);
      }

    let sueldoPlanilla=null;
    let rxh=d.remuneracion

    if(d.modalidad==='planilla'){
      sueldoPlanilla=d.remuneracion;
      rxh=null;
    }

    let indAsignFamiliar = lastContract.ind_asign_familiar
    let asignFamiliar = lastContract.asignacion_familiar

    const factorPlanilla=parseFloat((await parameterService.findParameterValue("factor_planilla"))[0].valor_num_1);
    const factorRxhPracticas=parseFloat((await parameterService.findParameterValue("factor_rxh_practicas"))[0].valor_num_1);

    let clm;
    if(d.opcion_renovacion==="mismas condiciones"){
      clm=lastContract.clm;
    } else if(d.modalidad === "planilla"){
      clm=d.remuneracion*factorPlanilla + parseFloat(d.bono_men)
    } else if (d.modalidad === "rxh" || d.modalidad === "practicas"){
      clm=d.remuneracion*factorRxhPracticas + parseFloat(d.bono_men)
    }
    //Insert
    const queryInsert=`INSERT INTO contrato(
      cod_colaborador,tipo, modalidad,ind_asign_familiar,asignacion_familiar, sueldo_planilla, rxh,
       bono, clm, fecha_inicio, fecha_fin,estado,fecha_reg,usuario_registro,empresa,nro_contrato_ant)
      VALUES (?,'R',?,?,?, ?,?, ?, ?, ?,?,'AC',CURRENT_DATE,?,?,?);`;
    await sequelize.query(queryInsert,
      {
      type: QueryTypes.INSERT,
      replacements: [d.cod_colaborador,d.modalidad,indAsignFamiliar,asignFamiliar,
      sueldoPlanilla,rxh,d.bono_men,clm,d.fecha_inicio_nuevo,d.fecha_fin_nuevo,usuarioReg,d.empresa,lastContract.cod_contrato]
      });
    //Update a inactivo el contrato anterior
    const query1=`UPDATE contrato SET
                  estado = 'RE',
                  fecha_act = CURRENT_DATE,
                  usuario_act = '${usuarioReg}'
                  WHERE cod_colaborador=${d.cod_colaborador}`

    await sequelize.query(query1);
    //Update al mapa de recursos

    const periodo =await periodService.getLastPeriod("factor_planilla");
    let queryUpdate=`UPDATE mapa_recursos SET `
    if(d.nuevo_nivel_puesto){
      queryUpdate += `nivel = '${d.nivel}', `
    }
    if(d.cod_puesto){
      queryUpdate += `perfil = '${d.cod_puesto}', `
    }
    queryUpdate += `fecha_fin_contrato = '${d.fecha_fin_nuevo}'`
    queryUpdate += `WHERE cod_colaborador=${d.cod_colaborador} and periodo = '${periodo.periodo}'`

    await sequelize.query(queryUpdate);

  }



  async findModalidad(id){
    const query=``;
    return sequelize.query(query,{
      type: QueryTypes.SELECT,
      replacements: [id]
    });
  }





}

module.exports = ContractService;
