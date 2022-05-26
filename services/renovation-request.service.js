const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

const UserService = require('../services/user.service');
const ContractService = require('../services/contract.service');

const userService = new UserService();
const contractService = new ContractService();

// Sentencias
const getInsert = (attributes = '*') => {
  return `INSERT INTO solicitud_renovacion(${ attributes.toString() })`;
};

class RenovationRequestService {
  async modifyDataInput(dataIn){
    const autocompData= await this.fillDataAutocompleted(dataIn.cod_mapa_recurso);
    if(dataIn.opcion_renovacion==="mismas condiciones"){
      return {...dataIn,...autocompData};
    }else{
      return {};
    }

  }

  async fillDataAutocompleted(cod_mapa_recurso){
    var query;
    /////Seleccionamos cod_colaborador,cod_cliente
      query=`SELECT mapa_recursos.cod_colaborador,colaborador.nro_documento,
            CONCAT(colaborador.nombres,' ',colaborador.apellido_pat,' ',colaborador.apellido_mat) AS nombres,
            mapa_recursos.cod_cliente,nombre_corto,linea_negocio AS cod_linea_negocio
            FROM mapa_recursos
            INNER JOIN colaborador ON mapa_recursos.cod_colaborador=colaborador.cod_colaborador
            INNER JOIN cliente ON mapa_recursos.cod_cliente=cliente.cod_cliente
            WHERE cod_mapa_recurso=? ;`;
    let [data1]=await sequelize.query(query,
      {
      type: QueryTypes.SELECT,
      replacements: [cod_mapa_recurso]
      });
    /////Seleccionamos empresa,modalidad,remuneracion,bono_men,fecha_fin_ant,fecha_inicio_nuevo
    query=`SELECT empresa,modalidad,(COALESCE(sueldo_planilla,0)+COALESCE(rxh,0)) AS remuneracion,bono AS bono_men,
    fecha_fin AS fecha_fin_ant,(fecha_fin+1) AS fecha_inicio_nuevo
    FROM contrato
    WHERE cod_colaborador=?
    ORDER BY cod_contrato DESC LIMIT 1;`;
    let [data2]=await sequelize.query(query,
    {
    type: QueryTypes.SELECT,
    replacements: [data1.cod_colaborador]
    });
    /////Seleccionamos puesto,cod_puesto y nivel
    query=`SELECT puesto,colaborador.cod_puesto,nivel
    FROM colaborador
    INNER JOIN puesto ON colaborador.cod_puesto=puesto.cod_puesto
    WHERE cod_colaborador=? ;`;
    let [data3]=await sequelize.query(query,
    {
    type: QueryTypes.SELECT,
    replacements: [data1.cod_colaborador]
    });
    /////Se colocan los valores por defecto para esta opcion de renovacion
    let data4={
        "modalidad_bono":"mensual",/////////ALERTA//ALERTA//AGREGAR A LA TABLA Y AL FLUJO DE CONTRATACION, NO DESDE AQUÍ
        "nueva_modalidad":"F",
        "nuevo_sueldo":"F",
        "nuevo_bono":"F",
        "nuevo_puesto":"F",
        "nuevo_nivel_puesto":"F",
        "estado":"Pendiente Aprobacion"
    }
    ///////////////////Unimos todos los datos que ya teníamos guardados y los nuevos
    return {...data1,...data2,...data3,...data4};
  }

  async create(data) {
    const fields = [
      'cod_colaborador','cod_cliente','cod_linea_negocio','opcion_renovacion', 'empresa',
      'nueva_modalidad', 'nuevo_sueldo','nuevo_bono', 'nuevo_puesto',
      'nuevo_nivel_puesto', 'cod_puesto',
      'nivel', 'modalidad', 'remuneracion', 'modalidad_bono',
      'bono_men', 'estado', 'fecha_fin_ant', 'fecha_inicio_nuevo',
      'fecha_fin_nuevo'
    ];
    // Sentencia
    const query = `${ getInsert(fields) }
              VALUES(${ fields.map(field => "(:".concat(field).concat(")")).toString() })
              RETURNING *;`;

    try {
      const [[ newRequestService ]] = await sequelize.query(query, {
        type: QueryTypes.INSERT,
        replacements: data
      });
      return newRequestService;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw boom.conflict('there was a conflict');
      }
    }
  }

  findBy(body){
    var query=`SELECT tipo_solicitud,cod_solicitud_renovacion,solicitud_renovacion.fecha_reg,cliente.nombre_corto,
    cod_linea_negocio,puesto.puesto,colaborador.nivel,colaborador.nro_documento,CONCAT(colaborador.nombres,' ',colaborador.apellido_pat,' ',colaborador.apellido_mat) AS nombre_apellidos,
    modalidad,remuneracion,bono_men,solicitud_renovacion.estado,fecha_aprob,fecha_aprob_gg
    FROM solicitud_renovacion
    INNER JOIN colaborador ON solicitud_renovacion.cod_colaborador=colaborador.cod_colaborador
    INNER JOIN cliente ON solicitud_renovacion.cod_cliente=cliente.cod_cliente
    INNER JOIN puesto ON colaborador.cod_puesto=puesto.cod_puesto `;
    if(body.length!=0){
      query+="WHERE cod_solicitud_renovacion>0 ";
    }
    if(body.cod_cliente){
      query+=`AND solicitud_renovacion.cod_cliente = '${body.cod_cliente}' `;
    }
    if(body.cod_linea_negocio){
      query+=`AND cod_linea_negocio = '${body.cod_linea_negocio}' `;
    }
    if(body.nro_documento){
      query+=`AND colaborador.nro_documento = '${body.nro_documento}' `;
    }
    if(body.nombre){
      const nombre=(body.nombre).toLowerCase();
      query+=`AND (lower(CONCAT(colaborador.nombres,' ',colaborador.apellido_pat,' ',colaborador.apellido_mat)) like '%${nombre}%') `
    }
    if(body.estado){
      query+=`AND solicitud_renovacion.estado = '${body.estado}'`;
    }

     return query;
  }

  findOne(){
    return `SELECT tipo_solicitud,cod_solicitud_renovacion,nombre_corto,nro_documento,nombres,apellido_pat,apellido_mat,
            opcion_renovacion,nueva_modalidad,nuevo_sueldo,nuevo_bono,nuevo_puesto,nuevo_nivel_puesto,
            colaborador.cod_puesto,puesto.puesto,colaborador.nivel,modalidad,remuneracion,bono_men,
            fecha_fin_ant,fecha_inicio_nuevo,fecha_fin_nuevo,solicitud_renovacion.estado,motivo_rechazo,
            solicitud_renovacion.cod_linea_negocio,modalidad_bono,solicitud_renovacion.empresa
            FROM solicitud_renovacion
            INNER JOIN colaborador ON solicitud_renovacion.cod_colaborador=colaborador.cod_colaborador
            INNER JOIN cliente ON solicitud_renovacion.cod_cliente=cliente.cod_cliente
            INNER JOIN puesto ON colaborador.cod_puesto=puesto.cod_puesto
            WHERE cod_solicitud_renovacion=? ;`;

  }

  async findState(cod){
    const query=`SELECT estado FROM solicitud_renovacion
                 WHERE cod_solicitud_renovacion=? ;`;
    const [data]=await sequelize.query(query,
      {
        type: QueryTypes.SELECT,
        replacements: [cod]
      });
    return data.estado;
  }

   async approve(cod,codUsuario){
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN

    const usuarioReg=await userService.findUsername(codUsuario);
    const [data]=await sequelize.query(`SELECT * from solicitud_renovacion WHERE cod_solicitud_renovacion=${cod}`);
    await contractService.renovationContractfromSolicitude(data[0],usuarioReg);
    let query=`UPDATE solicitud_renovacion
                 SET estado='Aprobado',
                 fecha_aprob=CURRENT_DATE,
                 usuario_aprob='${usuarioReg}'
              WHERE cod_solicitud_renovacion=${cod}`;
    await sequelize.query(query);
    await sequelize.query(`COMMIT;`);//FIN DE LA TRANSACCIÓN
  }

  async reject(cod,body){
    var query=`UPDATE solicitud_renovacion
                 SET estado='Rechazado',`
    if(body.motivo_rechazo){
      query+=`motivo_rechazo='${body.motivo_rechazo}',`;
    }
      query+= `fecha_rechaz=CURRENT_DATE
              WHERE cod_solicitud_renovacion=${cod}`;
    await sequelize.query(query);
  }

  async isThereAPreviousSolicitude(codColab){
    const query=`SELECT TRUE
                WHERE EXISTS (SELECT 1
                              FROM solicitud_renovacion
                              WHERE cod_colaborador = ? AND estado<>'Rechazado' AND estado<>'Aprobado'); `;
     return sequelize.query(query,
      {
        type: QueryTypes.SELECT,
        replacements: [codColab]
      });
  }

}
module.exports = RenovationRequestService;
