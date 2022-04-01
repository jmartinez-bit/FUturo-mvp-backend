const { models } = require('../libs/sequelize');
const sequelize = require('../libs/sequelize');
const { Op, Sequelize } = require('sequelize');

const select="SELECT linea_negocio,mapa_recursos.estado,perfil.nombre_perfil,mapa_recursos.nivel,fecha_inicio,fecha_fin,asignacion,clm_efectivo,produccion,productividad,CONCAT(nombres,' ',apellido_pat,' ',apellido_mat) AS nombre_colaborador "+
             "FROM mapa_recursos INNER JOIN colaborador ON mapa_recursos.cod_colaborador=colaborador.cod_colaborador "+
             "INNER JOIN perfil ON mapa_recursos.perfil=perfil.cod_perfil ";

class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientAndPeriod(cod_cliente,periodo){
    const query=select+
    "WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"';";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findByClientPeriodAndProfile(cod_cliente,periodo,cod_perfil){
    const query=select+
                "WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' AND mapa_recursos.perfil="+cod_perfil+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findOne(id) {
    try {
      const mapaRecurso = await models.MapaRecurso.findByPk(id,
        {
          attributes: ['horasServicio', 'licencias', 'faltas', 'vacaciones', 'horasExtras', 'totalHorasAsignaciones', 'totalHorasFacturables', 'eficiencia', 'rendimiento', 'capacity', 'clm', 'fechaFinContrato', 'fechaInicio', 'fechaFin'],
          include: [
            {
              model: models.Colaborador,
              as: 'colaborador',
              attributes: ['codColaborador', 'nombres', 'apellidoPat', 'apellidoMat'],
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
                            [Op.gte]: Sequelize.literal(`(SELECT fecha_inicio FROM mapa_recursos WHERE mapa_recursos.cod_mapa_recurso = ${id})`)
                          }
                        },
                        {
                          fechaFin: {
                            [Op.lte]: Sequelize.literal(`(SELECT fecha_fin FROM mapa_recursos WHERE mapa_recursos.cod_mapa_recurso = ${id})`)
                          }
                        },
                      ]
                    }
                  }
                },
                {
                  model: models.Contrato,
                  attributes: ['codContrato', 'modalidad', 'fechaFin', 'sueldoPlanilla', 'bono', 'eps', 'clm'],
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

  async findByClientPeriodAndNames(cod_cliente,periodo,cod_colab){
    const query=select+
                "WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' AND mapa_recursos.cod_colaborador="+cod_colab+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findByClientPeriodProfileAndNames(cod_cliente,periodo,cod_perfil,cod_colab){
    const query=select+
                "WHERE cod_cliente="+cod_cliente+" AND periodo='"+periodo+"' AND mapa_recursos.perfil="+cod_perfil+" AND mapa_recursos.cod_colaborador="+cod_colab+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findPeriods(){
    const query="SELECT periodo FROM periodo";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findCustomers(idDM){
    const query="SELECT cartera_cliente.cod_cliente,nombre_corto FROM cliente INNER JOIN cartera_cliente ON cliente.cod_cliente=cartera_cliente.cod_cliente "+
                "WHERE cartera_cliente.estado='A' AND cod_usuario="+idDM+";";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findProfiles(){
    const query="SELECT cod_perfil,nombre_perfil FROM perfil "+
                "WHERE estado='A';";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findCollaboratorNames(cod_cliente){
    const query="SELECT cod_colaborador,nombres,apellido_pat,apellido_mat FROM colaborador "+
                "WHERE EXISTS(SELECT cod_colaborador FROM mapa_recursos WHERE colaborador.cod_colaborador=mapa_recursos.cod_colaborador "+
                "AND mapa_recursos.cod_cliente="+cod_cliente+")";
    const [data] = await sequelize.query(query);
    return data;
  }

}
module.exports = ResourcesService;
