const sequelize = require('../libs/sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM colaborador`;
};
const joinContrato = `INNER JOIN contrato ON colaborador."codColaborador" = contrato."codColaborador"`

class CollaboratorService{

  async findByCodColaboradorJoinContrato(codColaborador) {
    // Columnas
    const select = getSelect(['colaborador."codColaborador"', 'colaborador."nroDocumento"',
    'colaborador."nombres"', 'colaborador."apellidoPat"', 'colaborador."apellidoMat"', 'contrato."sueldoPlanilla"',
    'contrato."bono"', 'contrato."eps"', 'contrato."clm"', 'contrato."codContrato"', 'contrato."modalidad"', 'contrato."fechaFin"']);

    // Sentencia
    const query=`${ select } ${ joinContrato }
                WHERE colaborador."codColaborador"=${ codColaborador }
                ORDER BY contrato."codContrato" DESC LIMIT 1;`;
    const [data] = await sequelize.query(query);

    return data;
  }

}
module.exports = CollaboratorService;
