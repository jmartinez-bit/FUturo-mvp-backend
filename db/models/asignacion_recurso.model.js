const { Model, DataTypes,Sequelize} = require('sequelize');
const { COLABORADOR_TABLE } = require('./colaborador.model');
const { SERVICIO_TABLE } = require('./servicio.model');

const ASIGNACION_RECURSO_TABLE = 'asignacion_recurso';

const AsignacionRecursoSchema = {
  codAsignacion: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_asignacion'
  },
  codServicio: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: SERVICIO_TABLE,
      key: 'cod_servicio'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field:'cod_servicio'
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
  porAsignacion: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'por_asignacion'
  },
  fechaInicio: {
    allowNull: true,
    type: DataTypes.DATEONLY,
    field:'fecha_inicio'
  },
  fechaFin: {
    allowNull: true,
    type: DataTypes.DATE,
    field:'fecha_fin'
  },
  horasAsignacion: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'horas_asignacion'
  },
  puesto: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  nivel: {
    allowNull: true,
    type: DataTypes.STRING(20)
  },
  tarifa: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2)
  },
  prodPlanificada: {
    allowNull: true,
    type: DataTypes.DECIMAL(10, 2),
    field:'prod_planificada'
  },
  fechaReg: {
    allowNull: true,
    type: DataTypes.DATE,
    field:'fecha_reg'
  },
  usuarioReg: {
    allowNull: true,
    type: DataTypes.STRING(20),
    field:'usuario_reg'
  },
  fechaAct: {
    allowNull: true,
    type: DataTypes.DATE,
    field:'fecha_act'
  },
  usuarioAct: {
    allowNull: true,
    type: DataTypes.STRING(20),
    field:'usuario_act'
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
