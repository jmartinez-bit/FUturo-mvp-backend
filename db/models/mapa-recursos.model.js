const { Model, DataTypes, Sequelize } = require('sequelize');
const { COLABORADOR_TABLE } = require('./colaborador.model');
const { PERIODO_TABLE } = require('./periodo.model');

const MAPA_RECURSOS_TABLE = 'mapa-recurso';

const MapaRecursosSchema = {
  codMapaRecurso: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
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
    type: DataTypes.INTEGER
  },
  lineaNegocio: {
    allowNull: false,
    type: DataTypes.STRING(10),
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
      key: 'codColaborador'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
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
    type: DataTypes.DATE
  },
  fechaFin: {
    allowNull: false,
    type: DataTypes.DATE
  },
  fechaCese: {
    allowNull: false,
    type: DataTypes.DATE
  },
  fechaFinContrato: {
    allowNull: false,
    type: DataTypes.DATE
  },
  horasServicio: {
    allowNull: false,
    type: DataTypes.INTEGER
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
    type: DataTypes.DATE
  },
  finVacaciones: {
    allowNull: false,
    type: DataTypes.DATE
  },
  vacaciones: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  horasExtras: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  produccionHorasExtras: {
    allowNull: false,
    type: DataTypes.DECIMAL(10,2)
  },
  totalHorasAsignaciones: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  totalHorasFacturables: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  eficiencia: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2),
    get() {
      const value = this.getDataValue('eficiencia');
      return value === null ? null : parseFloat(value);
    }
  },
  rendimiento: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2),
    get() {
      const value = this.getDataValue('rendimiento');
      return value === null ? null : parseFloat(value);
    }
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
    type: DataTypes.DECIMAL(10, 2)
  },
  clmEfectivo: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
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
    type: DataTypes.CHAR(1)
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
