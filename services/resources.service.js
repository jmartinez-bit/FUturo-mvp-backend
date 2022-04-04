const sequelize = require('../libs/sequelize');
const CollaboratorService = require('./collaborator.service');
const AssignmentsService = require('./assignments.service');

function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM "mapa-recurso"`;
};

const collaboratorService = new CollaboratorService();
const assignmentsService = new AssignmentsService();

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
    const select = getSelect(['"mapa-recurso"."eficiencia"', '"mapa-recurso"."rendimiento"',
    '"mapa-recurso"."horasServicio"', '"mapa-recurso"."licencias"', '"mapa-recurso"."faltas"',
    '"mapa-recurso"."vacaciones"', '"mapa-recurso"."horasExtras"', '"mapa-recurso"."totalHorasAsignaciones"',
    '"mapa-recurso"."totalHorasFacturables"', '"mapa-recurso"."capacity"', '"mapa-recurso"."codColaborador"',
    '"mapa-recurso"."fechaInicio"', '"mapa-recurso"."fechaFin"']);

    // Sentencia
    const query = `${ select }
                WHERE "mapa-recurso"."codMapaRecurso"=${ id };`;
    const [[data]] = await sequelize.query(query);

    const [getContract] = await collaboratorService.findByCodColaboradorJoinContrato(data.codColaborador);
    const getAssignments = await assignmentsService.findByCodColaboradorJoinServicio(data.codColaborador, data.fechaInicio, data.fechaFin);
    delete data.codColaborador;
    delete data.fechaInicio;
    delete data.fechaFin;

    return {productividad: data, contrato: getContract, asignaciones: getAssignments};

  }

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
  //                                                       FROM "mapa-recurso"
  //                                                       WHERE "mapa-recurso"."codMapaRecurso" = ${id})`)
  //                         }
  //                       },
  //                       {
  //                         fechaFin: {
  //                           [Op.lte]: Sequelize.literal(`(SELECT "fechaFin"
  //                                                       FROM "mapa-recurso"
  //                                                       WHERE "mapa-recurso"."codMapaRecurso" = ${id})`)
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

  // async findByResourceMap(id) {
  //   const query=`SELECT "MapaRecurso"."codMapaRecurso",
  //   "MapaRecurso"."horasServicio",
  //   "MapaRecurso"."licencias",
  //   "MapaRecurso"."faltas",
  //   "MapaRecurso"."vacaciones",
  //   "MapaRecurso"."horasExtras",
  //   "MapaRecurso"."totalHorasAsignaciones",
  //   "MapaRecurso"."totalHorasFacturables",
  //   "MapaRecurso"."eficiencia",
  //   "MapaRecurso"."rendimiento",
  //   "MapaRecurso"."capacity",
  //   "colaborador"."codColaborador" AS "colaborador.codColaborador",
  //   "colaborador"."nroDocumento" AS "colaborador.nroDocumento",
  //   "colaborador"."nombres" AS "colaborador.nombres",
  //   "colaborador"."apellidoPat" AS "colaborador.apellidoPat",
  //   "colaborador"."apellidoMat" AS "colaborador.apellidoMat",
  //   "servicios"."codServicio" AS "colaborador.servicios.codServicio",
  //   "servicios"."tipoServicio" AS "colaborador.servicios.tipoServicio",
  //   "servicios"."descripcionServicio" AS "colaborador.servicios.descripcionServicio",
  //   "AsignacionRecurso"."codAsignacion" AS "colaborador.servicios.AsignacionRecurso.codAsignacion",
  //   "AsignacionRecurso"."porAsignacion" AS "colaborador.servicios.AsignacionRecurso.porAsignacion",
  //   "AsignacionRecurso"."fechaInicio" AS "colaborador.servicios.AsignacionRecurso.fechaInicio",
  //   "AsignacionRecurso"."fechaFin" AS "colaborador.servicios.AsignacionRecurso.fechaFin"
  //   FROM "mapa-recurso" AS "MapaRecurso"
  //   INNER JOIN "colaborador" AS "colaborador"
  //     ON "MapaRecurso"."codColaborador" = "colaborador"."codColaborador"
  //   INNER JOIN ( "asignacion-recursi" AS "AsignacionRecurso"
  //   INNER JOIN "servicio" AS "servicios" ON "servicios"."codServicio" = "AsignacionRecurso"."codServicio"
  //         AND ("AsignacionRecurso"."fechaInicio" >=
  //            (SELECT "fechaInicio"
  //             FROM "mapa-recurso"
  //             WHERE "mapa-recurso"."codMapaRecurso" = 1) AND "AsignacionRecurso"."fechaFin" <= (SELECT "fechaFin"
  //             FROM "mapa-recurso"
  //             WHERE "mapa-recurso"."codMapaRecurso" = 1))) ON "colaborador"."codColaborador" = "AsignacionRecurso"."codColaborador"
  //             WHERE "MapaRecurso"."codMapaRecurso" = ${id};`
  //   const [data] = await sequelize.query(query);
  //   return data;
  // }

}
module.exports = ResourcesService;
