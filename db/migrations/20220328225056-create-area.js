'use strict';

const { AREA_TABLE, AreaSchema } = require('../models/area.model');
const { ASIGNACION_RECURSO_TABLE, AsignacionRecursoSchema } = require('../models/asignacion-recurso.model');
const { COLABORADOR_TABLE, ColaboradorSchema } = require('../models/colaborador.model');
const { CONTRATO_TABLE, ContratoSchema } = require('../models/contratos.model');
const { LINEA_SERVICIO_TABLE, LineaServicioSchema } = require('../models/linea-servicio.model');
const { MAPA_RECURSOS_TABLE, MapaRecursosSchema } = require('../models/mapa-recursos.model');
const { PERIODO_TABLE, PeriodoSchema } = require('../models/periodo.model');
const { PUESTO_TABLE, PuestoSchema } = require('../models/puesto.model');
const { SERVICIO_TABLE, ServicioSchema } = require('../models/servicio.model');

module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(AREA_TABLE, AreaSchema);
    await queryInterface.createTable(LINEA_SERVICIO_TABLE, LineaServicioSchema);
    await queryInterface.createTable(PUESTO_TABLE, PuestoSchema);
    await queryInterface.createTable(COLABORADOR_TABLE, ColaboradorSchema);
    await queryInterface.createTable(CONTRATO_TABLE, ContratoSchema);
    await queryInterface.createTable(PERIODO_TABLE, PeriodoSchema);
    await queryInterface.createTable(SERVICIO_TABLE, ServicioSchema);
    await queryInterface.createTable(ASIGNACION_RECURSO_TABLE, AsignacionRecursoSchema);
    await queryInterface.createTable(MAPA_RECURSOS_TABLE, MapaRecursosSchema);
  },

  async down (queryInterface) {
    queryInterface.dropTable(AREA_TABLE);
    queryInterface.dropTable(ASIGNACION_RECURSO_TABLE);
    queryInterface.dropTable(COLABORADOR_TABLE);
    queryInterface.dropTable(CONTRATO_TABLE);
    queryInterface.dropTable(LINEA_SERVICIO_TABLE);
    queryInterface.dropTable(MAPA_RECURSOS_TABLE);
    queryInterface.dropTable(PERIODO_TABLE);
    queryInterface.dropTable(PUESTO_TABLE);
    queryInterface.dropTable(SERVICIO_TABLE);
  }
};
