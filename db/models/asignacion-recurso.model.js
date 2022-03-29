const { Model, DataTypes, Sequelize } = require('sequelize');
const { COLABORADOR_TABLE } = require('./colaborador.model');
const { SERVICIO_TABLE } = require('./servicio.model');

const ASIGNACION_RECURSO_TABLE = 'asignacion-recursi';

const AsignacionRecursoSchema = {
  codAsignacion: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  codServicio: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: SERVICIO_TABLE,
      key: 'codServicio'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
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
  porAsignacion: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  fechaInicio: {
    allowNull: false,
    type: DataTypes.DATE
  },
  fechaFin: {
    allowNull: false,
    type: DataTypes.DATE
  },
  horasAsignacion: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  puesto: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  nivel: {
    allowNull: false,
    type: DataTypes.STRING(20)
  },
  tarifa: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2)
  },
  prodPlanificada: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  fechaReg: {
    allowNull: false,
    type: DataTypes.DATE
  },
  usuarioReg: {
    allowNull: false,
    type: DataTypes.STRING(20)
  },
  fechaAct: {
    allowNull: false,
    type: DataTypes.DATE
  },
  usuarioAct: {
    allowNull: false,
    type: DataTypes.STRING(20)
  }
}

class AsignacionRecurso extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ASIGNACION_RECURSO_TABLE,
      modelName: 'AsignacionRecurso',
      timestamps: false
    }
  }
}

module.exports = { AsignacionRecurso, AsignacionRecursoSchema, ASIGNACION_RECURSO_TABLE }
