const sequelize = require('../libs/sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM colaborador`;
};
const joinContrato = `INNER JOIN contrato ON colaborador.cod_colaborador = contrato.cod_colaborador`;

class CollaboratorService{

  async findByCodColaboradorJoinContrato(codColaborador, periodo) {

    const {year, month} = {
      year: parseInt(periodo.substr(3)),
      month: parseInt(periodo.substring(0, 2))
    }

    // Columnas
    const select = getSelect(['colaborador.cod_colaborador', 'colaborador.nro_documento',
    'colaborador."nombres"', 'colaborador.apellido_pat', 'colaborador.apellido_mat', 'contrato.sueldo_planilla',
    'contrato.bono', 'contrato.eps', 'contrato.clm', 'contrato.cod_contrato', 'contrato.modalidad', 'contrato.fecha_fin']);

    // Sentencia
    const query=`${ select } ${ joinContrato }
                WHERE colaborador.cod_colaborador=${ codColaborador }
                AND to_date('${ month + 1 }-${ year }', 'MM-YYYY') >= contrato.fecha_inicio
                AND to_date('${ month }-${ year }', 'MM-YYYY') <= contrato.fecha_fin
                ORDER BY contrato.cod_contrato DESC LIMIT 1;`;
    const [[data]] = await sequelize.query(query);

    return data;
  }

  async createCollaboratorfromSolicitude(d,usuarioReg){
    const query=`INSERT INTO colaborador(tipo_doc, nro_documento, cod_puesto, nivel,cod_area, nombres, apellido_mat,
                 apellido_pat, fecha_nacimiento, correo_personal, celular_personal,direccion,distrito,provincia,fecha_reg,usuario_reg)
                 VALUES ('${d.tipo_documento}','${d.nro_documento}',${d.cod_puesto},'${d.nivel}',1,'${d.nombre}',
                 '${d.ape_materno}','${d.ape_paterno}','${d.fecha_nacimiento}', '${d.correo}','${d.nro_celular}',
                 '${d.direccion}','${d.distrito}','${d.provincia}',CURRENT_DATE,'${usuarioReg}');`;
    await sequelize.query(query);
  }

  async findIdCollaborator(nro_documento){
    nro_documento="'"+nro_documento+"'";
    const query=`SELECT cod_colaborador from colaborador
                  WHERE nro_documento=${nro_documento} ;`;
    const [data]= await sequelize.query(query);
    return data[0].cod_colaborador;
  }

}
module.exports = CollaboratorService;
