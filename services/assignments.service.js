const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');
const UserService = require('../services/user.service');

const userService = new UserService();

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

    if (data.length === 0) {
      throw boom.notFound('assignments not found');
    }

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

  async maxAccumulatedAssignedPercentageInAnInterval(fechaIni,fechaFin,codColaborador,cod_asignacion){
    const query=`SELECT cod_asignacion,fecha_inicio,fecha_fin,por_asignacion FROM asignacion_recursos
                 WHERE cod_colaborador=? AND cod_asignacion<>?
                 AND (
                 fecha_inicio<= to_date(?, 'YYYY-MM-DD') AND fecha_fin>=to_date(?, 'YYYY-MM-DD')
                 )
                 ORDER BY fecha_inicio ASC ;`;
    const data=await sequelize.query(query,{
      type: QueryTypes.SELECT,
      replacements: [codColaborador,
        cod_asignacion,fechaFin,fechaIni]
    });
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

    var indexIni = sortedFechas.findIndex(a=> a.ind == "INI");
    var indexFin = sortedFechas.findIndex(a=> a.ind == "FIN");

    porcentajes=porcentajes.slice(indexIni+1, indexFin+1);

    return Math.max(...porcentajes);
  }

  async validateCrosses(fechaIni, fechaFin, codColab,codServ,cod_asignacion) {
    const query=`SELECT COUNT(*) FROM asignacion_recursos
    WHERE cod_colaborador=? AND cod_servicio=? AND cod_asignacion<>?
    AND (    (fecha_inicio<=to_date(?, 'YYYY-MM-DD') AND fecha_fin>=to_date(?, 'YYYY-MM-DD'))
          OR (fecha_inicio<=to_date(?, 'YYYY-MM-DD') AND fecha_fin>=to_date(?, 'YYYY-MM-DD'))
        ); `
    const [data]=await sequelize.query(query,{
      type: QueryTypes.SELECT,
      replacements: [codColab,codServ,cod_asignacion,
      fechaIni,fechaIni,fechaFin,fechaFin]
      });
    var rta;
    if(parseFloat(data.count)===0){
         rta={"error":false,"message":"Las fechas de asignacion son validas"};
    }else{
         rta={"error":true,"message":"Las fechas de asignacion se cruzan con asignaciones del mismo colaborador en el mismo servicio"};
    }

    return rta;
  }

  async validateDates(fechaIni, fechaFin, codColab,codServ,cod_asignacion) {

  var [data] = await sequelize.query(`SELECT fecha_inicio,fecha_fin FROM contrato WHERE cod_colaborador=? AND estado='AC' ;`,
  {
    type: QueryTypes.SELECT,
    replacements: [codColab]
  });
  const fechaInicioContrato=data.fecha_inicio;
  const fechaFinContrato=data.fecha_fin;
  [data] = await sequelize.query(`SELECT fecha_ini_planificada,fecha_fin_planificada,fecha_ini_real,fecha_fin_real FROM servicio WHERE cod_servicio=?;`,
  {
    type: QueryTypes.SELECT,
    replacements: [codServ]
  });
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
    rta=await this.validateCrosses(fechaIni, fechaFin, codColab,codServ,cod_asignacion);
  if(rta.error){
    error=true;
  }
  }

  if(!error){
    rta={"error":false,"message":"Las fechas de asignacion son validas"};
  }

  return rta;

}


async validatePercentage(fechaIni, fechaFin, codColab,percent,cod_asignacion) {
  const max=await this.maxAccumulatedAssignedPercentageInAnInterval(fechaIni, fechaFin, codColab,cod_asignacion);
  return (percent<=100-max);
}

async sumPlannedProductions(codServ, codAsignacion) {
  const [data]=await sequelize.query(`SELECT SUM(prod_planificada) FROM asignacion_recursos
                                      WHERE cod_servicio=? AND cod_asignacion<>? ;`,
  {
    type: QueryTypes.SELECT,
    replacements: [codServ,codAsignacion]
  });
  return parseFloat(data.sum||0);
}

async saleValue(codServ) {
  const [data]=await sequelize.query(`SELECT valor_venta_sol
                                        FROM servicio WHERE cod_servicio=?;`,
  {
    type: QueryTypes.SELECT,
    replacements: [codServ]
  });
  return parseFloat(data.valor_venta_sol);
}

async validatesumPlannedProductions(codServ, codAsignacion,prodPlanificada) {
  const sum= await this.sumPlannedProductions(codServ, codAsignacion);
  const saleValue=await this.saleValue(codServ);
  return (sum+prodPlanificada)>saleValue;
}

async createAssingment(d,prodPlanificada,codUsuario){
  const usuarioReg=await userService.findUsername(codUsuario);
  const {cod_servicio,cod_colaborador,percent,fecha_ini,fecha_fin,horas_asignadas,cod_puesto,nivel,tarifa}=d;
  const query=`INSERT INTO asignacion_recursos(cod_servicio, cod_colaborador, por_asignacion, fecha_inicio, fecha_fin,
               horas_asignacion, puesto, nivel, tarifa, prod_planificada, fecha_reg, usuario_reg)
               VALUES (?,?,?,?,?,?,
                ?,?,?,?,CURRENT_DATE,?);`;
  await sequelize.query(query,
    {
      type: QueryTypes.INSERT,
      replacements: [cod_servicio,cod_colaborador,percent,fecha_ini,fecha_fin,horas_asignadas,
        cod_puesto,nivel,tarifa,prodPlanificada,usuarioReg]
    });
  return {"error":false,"message":"Se creo asignación satisfactoriamente"};
}

async updateStartDateOnResourcesMap(codColab,codServ,codCliente,codLinServ,periodo){
 var [data]=await sequelize.query(`SELECT fecha_inicio FROM asignacion_recursos
                                  WHERE cod_colaborador=? AND cod_servicio=?
                                  ORDER BY fecha_inicio ASC;`,
  {
      type: QueryTypes.SELECT,
      replacements: [codColab,codServ]
  }
  );
 var fechaIniMin=data.fecha_inicio||null;
 if(fechaIniMin){
  fechaIniMin="'"+fechaIniMin+"'";
 }
    await sequelize.query(`UPDATE mapa_recursos
                          SET fecha_inicio=?
                          WHERE periodo=? AND cod_colaborador=?
                          AND cod_cliente=? AND linea_negocio=?;`,
  {
      type: QueryTypes.UPDATE,
      replacements: [fechaIniMin,periodo,codColab,codCliente,codLinServ]
  });

}

async updateEndDateOnResourcesMap(codColab,codServ,codCliente,codLinServ,periodo){
  var [data]=await sequelize.query(`SELECT fecha_fin FROM asignacion_recursos
                                  WHERE cod_colaborador=? AND cod_servicio=?
                                  ORDER BY fecha_fin DESC;`,
  {
      type: QueryTypes.SELECT,
      replacements: [codColab,codServ]
  });
  var fechaFinMax=data.fecha_fin||null;
  if(fechaFinMax){
    fechaFinMax="'"+fechaFinMax+"'";
   }
  await sequelize.query(`UPDATE mapa_recursos
                        SET fecha_fin=?
                        WHERE periodo=? AND cod_colaborador=?
                        AND cod_cliente=? AND linea_negocio=?;`,
  {
      type: QueryTypes.UPDATE,
      replacements: [fechaFinMax,periodo,codColab,codCliente,codLinServ]
  });

 }

 async updatePercentOnResourcesMap(codColab,codServ,codCliente,codLinServ,periodo){
    const  [data]=await sequelize.query(`SELECT sum(por_asignacion) FROM asignacion_recursos
                                    WHERE cod_colaborador=? AND cod_servicio=?
                                    AND fecha_inicio<=CURRENT_DATE AND CURRENT_DATE<=fecha_fin;`,
    {
      type: QueryTypes.SELECT,
      replacements: [codColab,codServ]
    });
     var asig=data.sum||null;
     if(asig){
      asig="'"+asig+"'";
     }
     await sequelize.query(`UPDATE mapa_recursos
                           SET asignacion=?
                           WHERE periodo=? AND cod_colaborador=?
                           AND cod_cliente=? AND linea_negocio=? ;`,
    {
      type: QueryTypes.UPDATE,
      replacements: [asig,periodo,codColab,codCliente,codLinServ]
    });

 }

 async showAssignments(codServ){
  const query=`SELECT cod_asignacion,asignacion_recursos.cod_servicio,asignacion_recursos.cod_colaborador,colaborador.nro_documento,
                puesto.cod_puesto,puesto.puesto,colaborador.nivel,CONCAT(nombres,' ',apellido_pat,' ',apellido_mat) AS nombres_apellidos,
                fecha_inicio,fecha_fin,por_asignacion,horas_asignacion,prod_planificada,tarifa
                FROM asignacion_recursos
                INNER JOIN colaborador ON asignacion_recursos.cod_colaborador=colaborador.cod_colaborador
                INNER JOIN puesto ON puesto.cod_puesto=colaborador.cod_puesto
                WHERE cod_servicio=?
                ORDER BY nombres_apellidos ASC,fecha_inicio DESC;`;
  const [data]=await sequelize.query(query,
    {
      type: QueryTypes.SELECT,
      replacements: [codServ]
    });
  return data;
 }

 async editAssingment(d,prodPlanificada,codUsuario){
  const usuarioReg=await userService.findUsername(codUsuario);
  const {cod_asignacion,percent,fecha_ini,fecha_fin,horas_asignadas,tarifa}=d;
  const query=`UPDATE asignacion_recursos
              SET por_asignacion=?,
              fecha_inicio=?,
              fecha_fin=?,
              horas_asignacion=?,
              tarifa=?,
              prod_planificada=?,
              fecha_act=CURRENT_DATE,
              usuario_act=?
              WHERE cod_asignacion=?;`
  await sequelize.query(query,
    {
      type: QueryTypes.UPDATE,
      replacements: [percent,fecha_ini,fecha_fin,horas_asignadas,tarifa,prodPlanificada,usuarioReg,cod_asignacion]
    });
  return {"error":false,"message":"Se edito asignación satisfactoriamente"};
 }

 async findCollaboratorCodAndClientCod(codAsig){
  const [rta] = await sequelize.query(`SELECT cod_colaborador,cod_servicio FROM asignacion_recursos
                                        WHERE cod_asignacion=?;`,
  {
    type: QueryTypes.SELECT,
    replacements: [codAsig]
  });
  return [rta.cod_colaborador,rta.cod_servicio];
 }

 async deleteAssignment(codAsig){
  await sequelize.query(`DELETE  FROM asignacion_recursos
                                        WHERE cod_asignacion=?;`,
  {
    type: QueryTypes.DELETE,
    replacements: [codAsig]
  });
  return {"error":false,"message":"Se eliminó la asignación satisfactoriamente"};
 }
}

module.exports = AssignmentsService;
