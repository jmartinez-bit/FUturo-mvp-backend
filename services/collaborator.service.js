const sequelize = require('../libs/sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM colaborador`;
};
const joinContrato = `INNER JOIN contrato ON colaborador.cod_colaborador = contrato.cod_colaborador`

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
                AND (${ year } = EXTRACT(year FROM contrato.fecha_inicio) AND ${ year } = EXTRACT(year FROM contrato.fecha_fin))
                AND (${ month } BETWEEN EXTRACT(month FROM contrato.fecha_inicio) AND EXTRACT(month FROM contrato.fecha_fin))
                ORDER BY contrato.cod_contrato DESC LIMIT 1;`;
    const [[data]] = await sequelize.query(query);

    return data;
  }

}
module.exports = CollaboratorService;
