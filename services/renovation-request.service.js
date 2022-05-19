const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');

// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM solicitud_renovacion`;
};

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
    var query=`SELECT tipo_solicitud,cod_solicitud_contratacion,solicitud_contratacion.fecha_reg,cliente.nombre_corto,
    cod_linea_negocio,puesto.puesto,nivel,nro_documento,CONCAT(nombre,' ',ape_paterno,' ',ape_materno) AS nombre_apellidos,
    modalidad,remuneracion,bono_men,solicitud_contratacion.estado,fecha_aprob,ind_aprobacion_gg,fecha_aprob_gg
    FROM solicitud_renovacion
    INNER JOIN cliente ON solicitud_contratacion.cod_cliente=cliente.cod_cliente
    INNER JOIN puesto ON solicitud_contratacion.cod_puesto=puesto.cod_puesto `;
    if(body.length!=0){
      query+="WHERE cod_solicitud_contratacion>0 ";
    }
    if(body.cod_cliente){
      query+=`AND solicitud_contratacion.cod_cliente = '${body.cod_cliente}' `;
    }
    if(body.cod_linea_negocio){
      query+=`AND cod_linea_negocio = '${body.cod_linea_negocio}' `;
    }
    if(body.nro_documento){
      query+=`AND nro_documento = '${body.nro_documento}' `;
    }
    if(body.nombre){
      const nombre=(body.nombre).toLowerCase();
      query+=`AND (lower(CONCAT(nombre,' ',ape_paterno,' ',ape_materno)) like '%${nombre}%') `
    }
    if(body.estado){
      query+=`AND solicitud_contratacion.estado = '${body.estado}'`;
    }

     return query;
  }

}
module.exports = RenovationRequestService;
