const { models } = require('../libs/sequelize');
const sequelize = require('../libs/sequelize');
const { Op, Sequelize } = require('sequelize');

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

  async findOne(id) {
    try {
      const mapaRecurso = await models.MapaRecurso.findByPk(id,
        {
          attributes: ['horasServicio', 'licencias', 'faltas',
                       'vacaciones', 'horasExtras', 'totalHorasAsignaciones',
                       'totalHorasFacturables', 'eficiencia', 'rendimiento', 'capacity'],
          include: [
            {
              model: models.Colaborador,
              as: 'colaborador',
              attributes: ['codColaborador', 'nroDocumento', 'nombres',
                           'apellidoPat', 'apellidoMat'],
              required: true,
              include: [
                {
                  model: models.Servicio,
                  attributes: ['tipoServicio', 'descripcionServicio'],
                  as: 'servicios',
                  required: true,
                  through: {
                    attributes: ['porAsignacion', 'fechaInicio', 'fechaFin'],
                    where: {
                      [Op.and]: [
                        {
                          fechaInicio: {
                            [Op.gte]: Sequelize.literal(`(SELECT "fechaInicio"
                                                        FROM "mapa-recurso"
                                                        WHERE "mapa-recurso"."codMapaRecurso" = ${id})`)
                          }
                        },
                        {
                          fechaFin: {
                            [Op.lte]: Sequelize.literal(`(SELECT "fechaFin"
                                                        FROM "mapa-recurso"
                                                        WHERE "mapa-recurso"."codMapaRecurso" = ${id})`)
                          }
                        },
                      ]
                    }
                  }
                },
                {
                  model: models.Contrato,
                  attributes: ['codContrato', 'modalidad', 'fechaFin',
                               'sueldoPlanilla', 'bono', 'eps', 'clm'],
                  as: 'contratos',
                  required: true,
                  order: [['codContrato', 'DESC']],
                  limit: 1
                }
              ]
            }
          ]
        }
      );
      if (!mapaRecurso) {
        console.log('no hay recurso');
      }
      return mapaRecurso;
    } catch(er) {
      console.log(er);
    }

  }

}
module.exports = ResourcesService;
