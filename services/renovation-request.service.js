const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

// Sentencias
const getInsert = (attributes = '*') => {
  return `INSERT INTO solicitud_renovacion(${ attributes.toString() })`;
};

class RenovationRequestService {

  async create(data) {
    const fields = [
      'opcion_renovacion', 'empresa', 'nueva_modalidad', 'nuevo_sueldo',
      'nuevo_bono', 'nuevo_puesto', 'nuevo_nivel_puesto', 'cod_puesto',
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
            fecha_fin_ant,fecha_inicio_nuevo,fecha_fin_nuevo,solicitud_renovacion.estado,motivo_rechazo
            FROM solicitud_renovacion
            INNER JOIN colaborador ON solicitud_renovacion.cod_colaborador=colaborador.cod_colaborador
            INNER JOIN cliente ON solicitud_renovacion.cod_cliente=cliente.cod_cliente
            INNER JOIN puesto ON colaborador.cod_puesto=puesto.cod_puesto
            WHERE cod_solicitud_renovacion=? ;`;

  }

}
module.exports = RenovationRequestService;