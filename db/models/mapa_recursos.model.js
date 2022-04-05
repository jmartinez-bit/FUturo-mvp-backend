const { Model, DataTypes } = require('sequelize');
const { COLABORADOR_TABLE } = require('./colaborador.model');
const { PERIODO_TABLE } = require('./periodo.model');

const MAPA_RECURSOS_TABLE = 'mapa_recursos';

const MapaRecursosSchema = {
  codMapaRecurso: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_mapa_recurso'
  },
  periodo: {
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: PERIODO_TABLE,
      key: 'periodo'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  codCliente: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'cod_cliente'
  },
  lineaNegocio: {
    allowNull: false,
    type: DataTypes.STRING(10),
    field:'linea_negocio'
  },
  asignacion: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2)
  },
  codColaborador: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: COLABORADOR_TABLE,
      key: 'cod_colaborador'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field:'cod_colaborador'
  },
  box: {
    allowNull: false,
    type: DataTypes.STRING(4)
  },
  perfil: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  nivel: {
    allowNull: false,
    type: DataTypes.STRING(20)
  },
  fechaInicio: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_inicio'
  },
  fechaFin: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_fin'
  },
  fechaCese: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_cese'
  },
  fechaFinContrato: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_fin_contrato'
  },
  horasServicio: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'horas_servicio'
  },
  licencias: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  faltas: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  inicioVacaciones: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'inicio_vacaciones'
  },
  finVacaciones: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fin_vacaciones'
  },
  vacaciones: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  horasExtras: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'horas_extras'
  },
  produccionHorasExtras: {
    allowNull: false,
    type: DataTypes.DECIMAL(10,2),
    field:'produccion_horas_extras'
  },
  totalHorasAsignaciones: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'total_horas_asignaciones'
  },
  totalHorasFacturables: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'total_horas_facturables'
  },
  eficiencia: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2)
  },
  rendimiento: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2)
  },
  capacity: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  clm: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  costoAsignacion: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    field:'costo_asignacion'
  },
  clmEfectivo: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    field:'clm_efectivo'
  },
  produccion: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  productividad: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2)
  },
  estado: {
    allowNull: false,
    type: DataTypes.CHAR(8)
  },
}

class MapaRecurso extends Model {

  static associate(models) {
    this.belongsTo(models.Colaborador, {as: 'colaborador', foreignKey: 'codColaborador'});
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MAPA_RECURSOS_TABLE,
      modelName: 'MapaRecurso',
      timestamps: false
    }
  }
}

module.exports = { MapaRecurso, MapaRecursosSchema, MAPA_RECURSOS_TABLE }
