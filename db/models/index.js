const { Area, AreaSchema } = require('./area.model');
const { AsignacionRecurso, AsignacionRecursoSchema } = require('./asignacion_recurso.model');
const { CarteraCliente, CarteraClienteSchema } = require('./cartera_cliente.model');
const { Cliente, ClienteSchema } = require('./cliente.model');
const { Colaborador, ColaboradorSchema } = require('./colaborador.model');
const { Contrato, ContratoSchema } = require('./contratos.model');
const { Feriados, FeriadosSchema } = require('./feriados.model');
const { LineaServicio, LineaServicioSchema } = require('./linea_servicio.model');
const { MapaRecurso, MapaRecursosSchema } = require('./mapa_recursos.model');
const { OpcionesPerfiles, OpcionesPerfilesSchema } = require('./opciones_perfiles.model');
const { Opciones, OpcionesSchema } = require('./opciones.model');
const { Perfil, PerfilSchema } = require('./perfil.model');
const { Periodo, PeriodoSchema } = require('./periodo.model');
const { PlanificacionProduccion, PlanificacionProduccionSchema } = require('./planificacion_produccion.model');
const { Produccion, ProduccionSchema } = require('./produccion.model');
const { Puesto, PuestoSchema } = require('./puesto.model');
const { Semanas, SemanasSchema } = require('./semanas.model');
const { Servicio, ServicioSchema } = require('./servicio.model');
const { Usuario, UsuarioSchema } = require('./usuario.model');


function setupModels(sequelize) {
  Area.init(AreaSchema, Area.config(sequelize));
  AsignacionRecurso.init(AsignacionRecursoSchema, AsignacionRecurso.config(sequelize));
  CarteraCliente.init(CarteraClienteSchema, CarteraCliente.config(sequelize));
  Cliente.init(ClienteSchema, Cliente.config(sequelize));
  Colaborador.init(ColaboradorSchema, Colaborador.config(sequelize));
  Contrato.init(ContratoSchema, Contrato.config(sequelize));
  Feriados.init(FeriadosSchema, Feriados.config(sequelize));
  LineaServicio.init(LineaServicioSchema, LineaServicio.config(sequelize));
  MapaRecurso.init(MapaRecursosSchema, MapaRecurso.config(sequelize));
  OpcionesPerfiles.init(OpcionesPerfilesSchema, OpcionesPerfiles.config(sequelize));
  Opciones.init(OpcionesSchema, Opciones.config(sequelize));
  Perfil.init(PerfilSchema, Perfil.config(sequelize));
  Periodo.init(PeriodoSchema, Periodo.config(sequelize));
  PlanificacionProduccion.init(PlanificacionProduccionSchema, PlanificacionProduccion.config(sequelize));
  Produccion.init(ProduccionSchema, Produccion.config(sequelize));
  Puesto.init(PuestoSchema, Puesto.config(sequelize));
  Semanas.init(SemanasSchema, Semanas.config(sequelize));
  Servicio.init(ServicioSchema, Servicio.config(sequelize));
  Usuario.init(UsuarioSchema, Usuario.config(sequelize));



  Area.associate(sequelize);
  AsignacionRecurso.associate(sequelize);
  CarteraCliente.associate(sequelize);
  Cliente.associate(sequelize);
  Colaborador.associate(sequelize);
  Contrato.associate(sequelize);
  Feriados.associate(sequelize);
  LineaServicio.associate(sequelize);
  MapaRecurso.associate(sequelize);
  OpcionesPerfiles.associate(sequelize);
  Opciones.associate(sequelize);
  Perfil.associate(sequelize);
  Periodo.associate(sequelize);
  PlanificacionProduccion.associate(sequelize);
  Produccion.associate(sequelize);
  Puesto.associate(sequelize);
  Semanas.associate(sequelize);
  Servicio.associate(sequelize);
  Usuario.associate(sequelize);


}

module.exports = setupModels;
