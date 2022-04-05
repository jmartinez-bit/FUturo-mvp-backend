const sequelize = require('../libs/sequelize');
// const CollaboratorService = require('./collaborator.service');
// const AssignmentsService = require('./assignments.service');

function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM mapa_recursos`;
};

// const collaboratorService = new CollaboratorService();
// const assignmentsService = new AssignmentsService();

class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientAndPeriod(cliente,periodo){
    const query="SELECT * FROM maparecursos WHERE cliente='"+cliente+"' AND periodo="+periodo+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findAll(){
    const query="SELECT * FROM maparecursos";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findByResourceMapID(id) {
    // Columnas
    const select = getSelect(['mapa_recursos.eficiencia', 'mapa_recursos.rendimiento',
    'mapa_recursos.horas_servicio', 'mapa_recursos.licencias', 'mapa_recursos.faltas',
    'mapa_recursos.vacaciones', 'mapa_recursos.horas_extras', 'mapa_recursos.total_horas_asignaciones',
    'mapa_recursos.total_horas_facturables', 'mapa_recursos.capacity']);

    // Sentencia
    const query = `${ select } WHERE mapa_recursos.cod_mapa_recurso=${ id };`;

    const [[data]] = await sequelize.query(query);

    return data;
  }

  // async findByResourceMapID(id) {
  //   // Columnas
  //   const select = getSelect(['mapa_recursos.eficiencia', 'mapa_recursos.rendimiento',
  //   'mapa_recursos.horas_servicio', 'mapa_recursos.licencias', 'mapa_recursos.faltas',
  //   'mapa_recursos.vacaciones', 'mapa_recursos.horas_extras', 'mapa_recursos.total_horas_asignaciones',
  //   'mapa_recursos.total_horas_facturables', 'mapa_recursos.capacity', 'mapa_recursos.cod_colaborador',
  //   'mapa_recursos.fecha_inicio', 'mapa_recursos.fecha_fin']);

  //   // Sentencia
  //   try {
  //     const query = `${ select }
  //               WHERE mapa_recursos.cod_mapa_recurso=${ id };`;
  //   const [[data]] = await sequelize.query(query);

  //   if (!data) return {};
  //   const getContract = await collaboratorService.findByCodColaboradorJoinContrato(data.cod_colaborador);
  //   const getAssignments = await assignmentsService.findByCodColaboradorJoinServicio(data.cod_colaborador, data.fecha_inicio, data.fecha_fin);
  //   delete data.codColaborador;
  //   delete data.fechaInicio;
  //   delete data.fechaFin;

  //   return {productividad: data, contrato: getContract, asignaciones: getAssignments};
  //   } catch(err) {
  //     console.log(err);
  //   }


  // }

  // async findOne(id) {
  //   try {
  //     const mapaRecurso = await models.MapaRecurso.findByPk(id,
  //       {
  //         attributes: ['horasServicio', 'licencias', 'faltas',
  //                      'vacaciones', 'horasExtras', 'totalHorasAsignaciones',
  //                      'totalHorasFacturables', 'eficiencia', 'rendimiento', 'capacity'],
  //         include: [
  //           {
  //             model: models.Colaborador,
  //             as: 'colaborador',
  //             attributes: ['codColaborador', 'nroDocumento', 'nombres',
  //                          'apellidoPat', 'apellidoMat'],
  //             required: true,
  //             include: [
  //               {
  //                 model: models.Servicio,
  //                 attributes: ['tipoServicio', 'descripcionServicio'],
  //                 as: 'servicios',
  //                 required: true,
  //                 through: {
  //                   attributes: ['porAsignacion', 'fechaInicio', 'fechaFin'],
  //                   where: {
  //                     [Op.and]: [
  //                       {
  //                         fechaInicio: {
  //                           [Op.gte]: Sequelize.literal(`(SELECT "fechaInicio"
  //                                                       FROM mapa_recursos
  //                                                       WHERE mapa_recursos."codMapaRecurso" = ${id})`)
  //                         }
  //                       },
  //                       {
  //                         fechaFin: {
  //                           [Op.lte]: Sequelize.literal(`(SELECT "fechaFin"
  //                                                       FROM mapa_recursos
  //                                                       WHERE mapa_recursos."codMapaRecurso" = ${id})`)
  //                         }
  //                       },
  //                     ]
  //                   }
  //                 }
  //               },
  //               {
  //                 model: models.Contrato,
  //                 attributes: ['codContrato', 'modalidad', 'fechaFin',
  //                              'sueldoPlanilla', 'bono', 'eps', 'clm'],
  //                 as: 'contratos',
  //                 required: true,
  //                 order: [['codContrato', 'DESC']],
  //                 limit: 1
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     );
  //     if (!mapaRecurso) {
  //       console.log('no hay recurso');
  //     }
  //     return mapaRecurso;
  //   } catch(er) {
  //     console.log(er);
  //   }

  // }

}
module.exports = ResourcesService;
