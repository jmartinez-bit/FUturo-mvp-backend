const sequelize = require('../libs/sequelize');

// Sentencias
const getSelect = (attributes = '*') => {
  return `SELECT ${ attributes.toString() } FROM asignacion_recursos`;
};

// JOINS
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


}
module.exports = AssignmentsService;
