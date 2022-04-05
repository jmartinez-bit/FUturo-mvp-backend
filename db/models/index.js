const { Area, AreaSchema } = require('./area.model');
const { AsignacionRecurso, AsignacionRecursoSchema } = require('./asignacion_recurso.model');
const { Colaborador, ColaboradorSchema } = require('./colaborador.model');
const { Contrato, ContratoSchema } = require('./contratos.model');
const { LineaServicio, LineaServicioSchema } = require('./linea_servicio.model');
const { MapaRecurso, MapaRecursosSchema } = require('./mapa_recursos.model');
const { Periodo, PeriodoSchema } = require('./periodo.model');
const { Puesto, PuestoSchema } = require('./puesto.model');
const { Servicio, ServicioSchema } = require('./servicio.model');


function setupModels(sequelize) {
  Area.init(AreaSchema, Area.config(sequelize));
  LineaServicio.init(LineaServicioSchema, LineaServicio.config(sequelize));
  Puesto.init(PuestoSchema, Puesto.config(sequelize));
  Contrato.init(ContratoSchema, Contrato.config(sequelize));
  Periodo.init(PeriodoSchema, Periodo.config(sequelize));
  Servicio.init(ServicioSchema, Servicio.config(sequelize));
  Colaborador.init(ColaboradorSchema, Colaborador.config(sequelize));
  MapaRecurso.init(MapaRecursosSchema, MapaRecurso.config(sequelize));
  AsignacionRecurso.init(AsignacionRecursoSchema, AsignacionRecurso.config(sequelize));

  Area.associate(sequelize.models);
  LineaServicio.associate(sequelize.models);
  Puesto.associate(sequelize.models);
  Contrato.associate(sequelize.models);
  Periodo.associate(sequelize.models);
  Servicio.associate(sequelize.models);
  Colaborador.associate(sequelize.models);
  AsignacionRecurso.associate(sequelize.models);
  MapaRecurso.associate(sequelize.models);

}

module.exports = setupModels;
