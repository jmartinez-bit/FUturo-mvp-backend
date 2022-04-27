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



  Area.associate(sequelize.models);
  LineaServicio.associate(sequelize.models);
  Puesto.associate(sequelize.models);
  Contrato.associate(sequelize.models);
  Periodo.associate(sequelize.models);
  Servicio.associate(sequelize.models);
  Colaborador.associate(sequelize.models);
  AsignacionRecurso.associate(sequelize.models);
  MapaRecurso.associate(sequelize.models);
  CarteraCliente.associate(sequelize.models);
  Cliente.associate(sequelize.models);
  Feriados.associate(sequelize.models);
  OpcionesPerfiles.associate(sequelize.models);
  Opciones.associate(sequelize.models);
  Perfil.associate(sequelize.models);
  PlanificacionProduccion.associate(sequelize.models);
  Produccion.associate(sequelize.models);
  Semanas.associate(sequelize.models);
  Usuario.associate(sequelize.models);


}

module.exports = setupModels;
