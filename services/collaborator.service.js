const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');


// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM colaborador`;
};
const joinContrato = `INNER JOIN contrato ON colaborador.cod_colaborador = contrato.cod_colaborador`;

class CollaboratorService{

  async findByCodColaboradorJoinContrato(codColaborador) {
    // Columnas
    const select = getSelect(['colaborador.cod_colaborador', 'colaborador.nro_documento',
    'colaborador."nombres"', 'colaborador.apellido_pat', 'colaborador.apellido_mat', 'contrato.sueldo_planilla',
    'contrato.bono', 'contrato.eps', 'contrato.clm', 'contrato.cod_contrato', 'contrato.modalidad', 'contrato.fecha_fin']);

    // Sentencia
    const query=`${ select } ${ joinContrato }
                WHERE colaborador.cod_colaborador=${ codColaborador }
                ORDER BY contrato.fecha_fin DESC LIMIT 1;`;
    const [data] = await sequelize.query(query);

    if (!data) {
      throw boom.notFound('contract not found');
    }

    return data[0];
  }

  async createCollaboratorfromSolicitude(d,usuarioReg){
    const query=`INSERT INTO colaborador(tipo_doc, nro_documento, cod_puesto, nivel,cod_area, nombres, apellido_mat,
                 apellido_pat, fecha_nacimiento,sexo, correo_personal, celular_personal,direccion,distrito,provincia,fecha_reg,usuario_reg)
                 VALUES (?,?,?,?,1,?,?,?,?,?,?,?,?,?,?,CURRENT_DATE,?);`;
    await sequelize.query(query,
      {
        type: QueryTypes.INSERT,
        replacements: [d.tipo_documento,d.nro_documento,d.cod_puesto,d.nivel,d.nombre,d.ape_materno,
          d.ape_paterno,d.fecha_nacimiento,d.sexo,d.correo,d.nro_celular,d.direccion,d.distrito,d.provincia,usuarioReg]
      });
  }

  async findIdCollaborator(nro_documento){
    const query=`SELECT cod_colaborador from colaborador
                  WHERE nro_documento=? ;`;
    const [data]= await sequelize.query(query,{
      type: QueryTypes.SELECT,
      replacements: [nro_documento]
    });
    return data.cod_colaborador;
  }

}
module.exports = CollaboratorService;
