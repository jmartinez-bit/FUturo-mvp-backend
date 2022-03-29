const { Area, AreaSchema } = require('./area.model');
const { AsignacionRecurso, AsignacionRecursoSchema } = require('./asignacion-recurso.model');
const { Colaborador, ColaboradorSchema } = require('./colaborador.model');
const { Contrato, ContratoSchema } = require('./contratos.model');
const { LineaServicio, LineaServicioSchema } = require('./linea-servicio.model');
const { MapaRecurso, MapaRecursosSchema } = require('./mapa-recursos.model');
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
  AsignacionRecurso.init(AsignacionRecursoSchema, AsignacionRecurso.config(sequelize));
  MapaRecurso.init(MapaRecursosSchema, MapaRecurso.config(sequelize));

  Area.associate(sequelize);
  LineaServicio.associate(sequelize);
  Puesto.associate(sequelize);
  Contrato.associate(sequelize);
  Periodo.associate(sequelize);
  Servicio.associate(sequelize);
  Colaborador.associate(sequelize);
  AsignacionRecurso.associate(sequelize);
  MapaRecurso.associate(sequelize);

}

module.exports = setupModels;
