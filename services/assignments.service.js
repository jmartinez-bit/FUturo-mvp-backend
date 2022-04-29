const sequelize = require('../libs/sequelize');
const UserService = require('../services/user.service');
const PeriodService = require('../services/period.service');

const userService = new UserService();
const periodService = new PeriodService();

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM asignacion_recursos`;
};
const joinService = `INNER JOIN servicio ON servicio.cod_servicio = asignacion_recursos.cod_servicio`;
const joinColaborador = `INNER JOIN colaborador ON asignacion_recursos.cod_colaborador = colaborador.cod_colaborador`;

class AssignmentsService{

  async findByCodColaboradorJoinServicio(cod_colaborador, periodo, cod_cliente) {

      // Columnas
    const select = getSelect(['servicio.tipo_servicio', 'servicio.descripcion_servicio',
    'asignacion_recursos.por_asignacion', 'asignacion_recursos.fecha_inicio',
    'asignacion_recursos.fecha_fin']);

    const query=`${ select } ${ joinService }
                WHERE asignacion_recursos.cod_colaborador=${ cod_colaborador }
                AND servicio.cod_cliente = ${ cod_cliente }
                AND to_date('${ periodo }', 'MM-YYYY') <= fecha_fin;`;
    const [data] = await sequelize.query(query);
    return data;

  }

  async findOneByCodServicioJoinColaborador(codServicio) {

    // Columnas
    const select = getSelect(['asignacion_recursos.cod_asignacion',
                              'asignacion_recursos.puesto',
                              'asignacion_recursos.nivel',
                              'asignacion_recursos.por_asignacion',
                              'asignacion_recursos.por_asignacion',
                              'asignacion_recursos.fecha_inicio',
                              'asignacion_recursos.fecha_fin',
                              'asignacion_recursos.horas_asignacion',
                              'colaborador.nombres',
                              'colaborador.apellido_pat',
                              'colaborador.apellido_mat'
                            ]);

    const query=`${ select } ${ joinColaborador }
                WHERE asignacion_recursos.cod_servicio=${ codServicio };`;
    const [data] = await sequelize.query(query);
    return data;

  }

  async maxAccumulatedAssignedPercentageInAnInterval(fechaIni,fechaFin,codColaborador){
    const query=`SELECT cod_asignacion,fecha_inicio,fecha_fin,por_asignacion FROM asignacion_recursos
                 WHERE cod_colaborador=${codColaborador}
                 AND (
                 fecha_inicio<= to_date('${ fechaFin }', 'YYYY-MM-DD') AND fecha_fin>=to_date('${ fechaIni }', 'YYYY-MM-DD')
                 )
                 ORDER BY fecha_inicio ASC ;`;
    const [data]=await sequelize.query(query);
    var fechas=[];
    //El array fechas tendra 3 campos:
    //-fecha
    //-modificador_porcentaje : cuando es el inicio de una asignacion se suma el porcentaje de esa asignacion,si es el final se resta.
    //-ind :  indica si es una fecha de asignacion de inicio o de fin(FA) o si es el inicio(INI) o fin(FIN) del intervalo evaluado
    data.forEach(element => fechas.push({"fecha":element.fecha_inicio,"modificador_porcentaje":element.por_asignacion,"ind":"FA"}));
    data.forEach(element => fechas.push({"fecha":element.fecha_fin,"modificador_porcentaje":element.por_asignacion*(-1),"ind":"FA"}));
    fechas.push({"fecha":fechaIni,"modificador_porcentaje":0,"ind":"INI"});
    fechas.push({"fecha":fechaFin,"modificador_porcentaje":0,"ind":"FIN"});
    var sortedFechas=fechas.sort((a, b) =>{
      if (a.fecha=== b.fecha) {
        return b.modificador_porcentaje-a.modificador_porcentaje;
      }else{
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      }
    });

    var porcentajes=[0];
    var porc=0;
    sortedFechas.forEach(element=>{
       porc+=element.modificador_porcentaje;
       porcentajes.push(porc);//el array porcentaje tendrá los acumulados
    })
    //console.log(sortedFechas);
    //console.log(porcentajes);

    var indexIni = sortedFechas.findIndex(a=> a.ind == "INI");
    var indexFin = sortedFechas.findIndex(a=> a.ind == "FIN");
    //console.log(indexIni);
    //console.log(indexFin);
    porcentajes=porcentajes.slice(indexIni+1, indexFin+1)
    //console.log(porcentajes);

    var max = Math.max(...porcentajes);

    return max;
  }

  async validateCrosses(fechaIni, fechaFin, codColab,codServ) {
    const [[data]]=await sequelize.query(`SELECT COUNT(*) FROM asignacion_recursos
                                      WHERE cod_colaborador=${codColab} AND cod_servicio=${codServ}
                                      AND (    (fecha_inicio<=to_date('${ fechaIni }', 'YYYY-MM-DD') AND fecha_fin>=to_date('${ fechaIni }', 'YYYY-MM-DD'))
                                            OR (fecha_inicio<=to_date('${ fechaFin }', 'YYYY-MM-DD') AND fecha_fin>=to_date('${ fechaFin }', 'YYYY-MM-DD'))
                                          ); `);
    if(parseFloat(data.count)===0){
    var  rta={"error":false,"message":"Las fechas de asignacion son validas"};
    }else{
         rta={"error":true,"message":"Las fechas de asignacion se cruzan con asignaciones del mismo colaborador en el mismo servicio"};
    }

    return rta;
  }

  async validateDates(fechaIni, fechaFin, codColab,codServ) {

  var [[data]] = await sequelize.query(`SELECT fecha_inicio,fecha_fin FROM contrato WHERE cod_colaborador=${codColab} AND estado='AC' ;`);
  const fechaInicioContrato=data.fecha_inicio;
  const fechaFinContrato=data.fecha_fin;
  [[data]] = await sequelize.query(`SELECT fecha_ini_planificada,fecha_fin_planificada,fecha_ini_real,fecha_fin_real FROM servicio WHERE cod_servicio=${codServ};`);
  const fechaFinPlanificada=data.fecha_fin_planificada;
  const fechaIniPlanificada=data.fecha_ini_planificada;
  const fechaIniReal=data.fecha_ini_real;
  const fechaFinReal=data.fecha_fin_real;

  var rta;
  var error=false;
  if(fechaFin<fechaIni && !error){
    rta={"error":true,"message":"La fecha fin asignada es menor a la fecha de inicio asignada"};
    error=true;
  }
  if(fechaIni<fechaInicioContrato && !error){
    rta={"error":true,"message":"La fecha inicio asignada es menor a la fecha de inicio de contrato"};
    error=true;
  }
  if(fechaFin>fechaFinContrato && !error){
    rta={"error":true,"message":"La fecha fin asignada es mayor a la fecha fin de contrato"};
    error=true;
  }
  if(fechaIniReal===null && !error){
    if(fechaIni<fechaIniPlanificada){
      rta={"error":true,"message":"La fecha inicial asignada es menor a la fecha inicial planificada"};
      error=true;
    }
  }else{
    if(fechaIni<fechaIniReal && !error){
      rta={"error":true,"message":"La fecha inicial asignada es menor a la fecha inicial real"};
      error=true;
    }
  }
  if(fechaFinReal===null && !error){
    if(fechaFin>fechaFinPlanificada){
      rta={"error":true,"message":"La fecha fin asignada es mayor a la fecha fin planificada"};
      error=true;
    }
  }else{
    if(fechaFin>fechaFinReal && !error){
      rta={"error":true,"message":"La fecha fin asignada es mayor a la fecha fin real"};
      error=true;
    }
  }

  if(!error){
    rta=await this.validateCrosses(fechaIni, fechaFin, codColab,codServ);
  if(rta.error){
    error=true;
  }
  }

  if(!error){
    rta={"error":false,"message":"Las fechas de asignacion son validas"};
  }

  return rta;

}


async validatePercentage(fechaIni, fechaFin, codColab,percent) {
  const max=await this.maxAccumulatedAssignedPercentageInAnInterval(fechaIni, fechaFin, codColab);
  if(percent>100-max){
    return false;
  }else{
    return true;
  }
}

async sumPlannedProductions(codServ, codAsignacion) {
  const [[data]]=await sequelize.query(`SELECT SUM(prod_planificada) FROM asignacion_recursos
                                      WHERE cod_servicio=${codServ} AND cod_asignacion<>${codAsignacion} ;`);
  return parseFloat(data.sum||0);
}

async saleValue(codServ) {
  const [[data]]=await sequelize.query(`SELECT valor_venta_sol
                                        FROM servicio WHERE cod_servicio=${codServ};`);
  return parseFloat(data.valor_venta_sol);
}

async validatesumPlannedProductions(codServ, codAsignacion,prodPlanificada) {
  const sum= await this.sumPlannedProductions(codServ, codAsignacion);
  const saleValue=await this.saleValue(codServ);
  const rta=(((sum+prodPlanificada)>saleValue)?true:false);
  return rta;
}

async createAssingment(d,prodPlanificada,codUsuario){
  const usuarioReg=await userService.findNames(codUsuario);
  const {cod_servicio,cod_colaborador,percent,fecha_ini,fecha_fin,horas_asignadas,cod_puesto,nivel,tarifa}=d;
  const query=`INSERT INTO asignacion_recursos(cod_servicio, cod_colaborador, por_asignacion, fecha_inicio, fecha_fin,
               horas_asignacion, puesto, nivel, tarifa, prod_planificada, fecha_reg, usuario_reg)
               VALUES (${cod_servicio},${cod_colaborador},'${percent}','${fecha_ini}','${fecha_fin}','${horas_asignadas}',
               ${cod_puesto},'${nivel}','${tarifa}','${prodPlanificada}',CURRENT_DATE,'${usuarioReg}');`;
  await sequelize.query(query);
  const [[data1]]=await sequelize.query(`SELECT cod_cliente,cod_linea_servicio FROM servicio
                                        WHERE cod_servicio=${cod_servicio}`);
  const data2=await periodService.getLastPeriod();
  const periodo=data2.periodo;
  await this.updateStartDateOnResourcesMap(cod_colaborador,data1.cod_cliente,fecha_ini,data1.cod_linea_servicio,periodo);
  await this.updateEndDateOnResourcesMap(cod_colaborador,data1.cod_cliente,fecha_fin,data1.cod_linea_servicio,periodo);
  await this.updatePercentOnResourcesMap(cod_colaborador,data1.cod_cliente,data1.cod_linea_servicio,percent,fecha_ini,fecha_fin,periodo)
  const rta={"error":false,"message":"Se creo asignación satisfactoriamente"};
  return rta;
}

async updateStartDateOnResourcesMap(codColab,codCliente,fechaIniNueva,codLinServ,periodo){
 const [[data]]=await sequelize.query(`SELECT fecha_inicio FROM mapa_recursos
                                  WHERE periodo='${periodo}' AND cod_colaborador=${codColab}
                                  AND cod_cliente=${codCliente} AND linea_negocio='${codLinServ}';`);

  const fechaIniAnt=data.fecha_inicio;
  if(fechaIniAnt===null || fechaIniNueva<fechaIniAnt){
    await sequelize.query(`UPDATE mapa_recursos
                          SET fecha_inicio='${fechaIniNueva}'
                          WHERE periodo='${periodo}' AND cod_colaborador=${codColab}
                          AND cod_cliente=${codCliente} AND linea_negocio='${codLinServ}';`);
  }
}

async updateEndDateOnResourcesMap(codColab,codCliente,fechaFinNueva,codLinServ,periodo){
  const [[data]]=await sequelize.query(`SELECT fecha_fin FROM mapa_recursos
                                   WHERE periodo='${periodo}' AND cod_colaborador=${codColab}
                                   AND cod_cliente=${codCliente} AND linea_negocio='${codLinServ}';`);
   const fechaFinAnt=data.fecha_fin;
   if(fechaFinAnt===null || fechaFinNueva>fechaFinAnt){
     await sequelize.query(`UPDATE mapa_recursos
                           SET fecha_fin='${fechaFinNueva}'
                           WHERE periodo='${periodo}' AND cod_colaborador=${codColab}
                           AND cod_cliente=${codCliente} AND linea_negocio='${codLinServ}';`);
   }
 }

 async updatePercentOnResourcesMap(codColab,codCliente,codLinServ,porc,fechaIniNueva,fechaFinNueva,periodo){
  var [[data]]=await sequelize.query(`SELECT CURRENT_DATE;`);
   const fechaActual=data.current_date;
   if(fechaIniNueva<=fechaActual && fechaActual<=fechaFinNueva){
     [[data]]=await sequelize.query(`SELECT asignacion FROM mapa_recursos
                                  WHERE periodo='${periodo}' AND cod_colaborador=${codColab}
                                  AND cod_cliente=${codCliente} AND linea_negocio='${codLinServ}';`);
     var asig=data.asignacion||0;
     asig+=porc;
     await sequelize.query(`UPDATE mapa_recursos
                           SET asignacion='${asig}'
                           WHERE periodo='${periodo}' AND cod_colaborador=${codColab}
                           AND cod_cliente=${codCliente} AND linea_negocio='${codLinServ}';`);
   }
 }

 async showAssignments(codServ){
  const query=`SELECT puesto.puesto,colaborador.nivel,nro_documento,CONCAT(nombres,' ',apellido_pat,' ',apellido_mat) AS nombres_apellidos,
                fecha_inicio,fecha_fin,por_asignacion,horas_asignacion
                FROM asignacion_recursos
                INNER JOIN colaborador ON asignacion_recursos.cod_colaborador=colaborador.cod_colaborador
                INNER JOIN puesto ON puesto.cod_puesto=colaborador.cod_puesto
                WHERE cod_servicio=${codServ}
                ORDER BY nombres_apellidos ASC,fecha_inicio DESC;`;
  const [data]=await sequelize.query(query);
  return data;
 }

}

module.exports = AssignmentsService;
