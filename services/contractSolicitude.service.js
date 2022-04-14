const sequelize = require('../libs/sequelize');

class ContractSolicitudeService{

  async createSolicitude(tipo_documento, nro_documento, nombre, ape_paterno,
    ape_materno, fecha_nacimiento, nro_celular, correo, direccion, distrito, cod_cliente, cod_linea_negocio, cod_puesto,
     nivel,banda_salarial, modalidad, remuneracion, bono_men, ind_eps, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional){

      if(ind_eps){ind_eps="'"+ind_eps+"'";}
      if(ind_sctr){ind_sctr="'"+ind_sctr+"'";}
      if(condicional_adicional){condicional_adicional="'"+condicional_adicional+"'";}


    const query=`INSERT INTO solicitud_contratacion (tipo_documento, nro_documento, nombre, ape_paterno, ape_materno,
     fecha_nacimiento, nro_celular, correo, direccion, distrito, cod_cliente, cod_linea_negocio, cod_puesto, nivel,
    banda_salarial, modalidad, remuneracion, bono_men, ind_eps, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional)
    VALUES ('${tipo_documento}','${nro_documento}','${nombre}','${ape_paterno}','${ape_materno}','${fecha_nacimiento}',
    '${nro_celular}','${correo}','${direccion}','${distrito}','${cod_cliente}','${cod_linea_negocio}','${cod_puesto}',
    '${nivel}','${banda_salarial}','${modalidad}','${remuneracion}',${bono_men},${ind_eps},${ind_sctr},'${fecha_inicio}',
    '${fecha_fin}',${condicional_adicional});`;

    await sequelize.query(query);
  }

}

module.exports = ContractSolicitudeService;
