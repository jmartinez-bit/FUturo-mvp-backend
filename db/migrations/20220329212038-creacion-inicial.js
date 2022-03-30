'use strict';

const { AREA_TABLE, AreaSchema } = require('../models/area.model');
const { ASIGNACION_RECURSO_TABLE, AsignacionRecursoSchema } = require('../models/asignacion_recurso.model');
const { CARTERA_CLIENTE_TABLE, CarteraClienteSchema } = require('../models/cartera_cliente.model');
const { CLIENTE_TABLE, ClienteSchema } = require('../models/cliente.model');
const { COLABORADOR_TABLE, ColaboradorSchema } = require('../models/colaborador.model');
const { CONTRATO_TABLE, ContratoSchema } = require('../models/contratos.model');
const { FERIADOS_TABLE, FeriadosSchema } = require('../models/feriados.model');
const { LINEA_SERVICIO_TABLE, LineaServicioSchema } = require('../models/linea_servicio.model');
const { MAPA_RECURSOS_TABLE, MapaRecursosSchema } = require('../models/mapa_recursos.model');
const { OPCIONES_PERFILES_TABLE, OpcionesPerfilesSchema } = require('../models/opciones_perfiles.model');
const { OPCIONES_TABLE, OpcionesSchema } = require('../models/opciones.model');
const { PERFIL_TABLE, PerfilSchema } = require('../models/perfil.model');
const { PERIODO_TABLE, PeriodoSchema } = require('../models/periodo.model');
const { PLANIFICACION_PRODUCCION_TABLE, PlanificacionProduccionSchema } = require('../models/planificacion_produccion.model');
const { PRODUCCION_TABLE, ProduccionSchema } = require('../models/produccion.model');
const { PUESTO_TABLE, PuestoSchema } = require('../models/puesto.model');
const { SEMANAS_TABLE, SemanasSchema } = require('../models/semanas.model');
const { SERVICIO_TABLE, ServicioSchema } = require('../models/servicio.model');
const { USUARIO_TABLE, UsuarioSchema } = require('../models/usuario.model');

module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(AREA_TABLE, AreaSchema);
    await queryInterface.createTable(ASIGNACION_RECURSO_TABLE, AsignacionRecursoSchema);
    await queryInterface.createTable(CARTERA_CLIENTE_TABLE, CarteraClienteSchema);
    await queryInterface.createTable(CLIENTE_TABLE, ClienteSchema);
    await queryInterface.createTable(COLABORADOR_TABLE, ColaboradorSchema);
    await queryInterface.createTable(CONTRATO_TABLE, ContratoSchema);
    await queryInterface.createTable(FERIADOS_TABLE, FeriadosSchema);
    await queryInterface.createTable(LINEA_SERVICIO_TABLE, LineaServicioSchema);
    await queryInterface.createTable(MAPA_RECURSOS_TABLE, MapaRecursosSchema);
    await queryInterface.createTable(OPCIONES_PERFILES_TABLE, OpcionesPerfilesSchema);
    await queryInterface.createTable(OPCIONES_TABLE, OpcionesSchema);
    await queryInterface.createTable(PERFIL_TABLE, PerfilSchema);
    await queryInterface.createTable(PERIODO_TABLE, PeriodoSchema);
    await queryInterface.createTable(PLANIFICACION_PRODUCCION_TABLE, PlanificacionProduccionSchema);
    await queryInterface.createTable(PRODUCCION_TABLE, ProduccionSchema);
    await queryInterface.createTable(PUESTO_TABLE, PuestoSchema);
    await queryInterface.createTable(SEMANAS_TABLE, SemanasSchema);
    await queryInterface.createTable(SERVICIO_TABLE, ServicioSchema);
    await queryInterface.createTable(USUARIO_TABLE, UsuarioSchema);

  },

  async down (queryInterface) {
    queryInterface.dropTable(AREA_TABLE);
    queryInterface.dropTable(ASIGNACION_RECURSO_TABLE);
    queryInterface.dropTable(CARTERA_CLIENTE_TABLE);
    queryInterface.dropTable(CLIENTE_TABLE);
    queryInterface.dropTable(COLABORADOR_TABLE);
    queryInterface.dropTable(CONTRATO_TABLE);
    queryInterface.dropTable(FERIADOS_TABLE);
    queryInterface.dropTable(LINEA_SERVICIO_TABLE);
    queryInterface.dropTable(MAPA_RECURSOS_TABLE);
    queryInterface.dropTable(OPCIONES_PERFILES_TABLE);
    queryInterface.dropTable(OPCIONES_TABLE);
    queryInterface.dropTable(PERFIL_TABLE);
    queryInterface.dropTable(PERIODO_TABLE);
    queryInterface.dropTable(PLANIFICACION_PRODUCCION_TABLE);
    queryInterface.dropTable(PRODUCCION_TABLE);
    queryInterface.dropTable(PUESTO_TABLE);
    queryInterface.dropTable(SEMANAS_TABLE);
    queryInterface.dropTable(SERVICIO_TABLE);
    queryInterface.dropTable(USUARIO_TABLE);
  }
};

