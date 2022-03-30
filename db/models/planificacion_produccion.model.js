const { Model, DataTypes } = require('sequelize');
//const { COLABORADOR_TABLE } = require('./colaborador.model');
//const { SERVICIO_TABLE } = require('./servicio.model');

const PLANIFICACION_PRODUCCION_TABLE = 'planificacion_produccion';

const PlanificacionProduccionSchema = {
  codPlanificacionProd: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_planificacion_prod'
  },
  codCliente: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'cod_cliente'
  },
  lineaServicio: {
    allowNull: false,
    type: DataTypes.STRING(10),
    field:'linea_servicio'
  },
  box: {
    allowNull: false,
    type: DataTypes.STRING(4),
  },
  tipoHora: {
    allowNull: false,
    type: DataTypes.CHAR(3),
    field:'tipo_hora'

  },
  tarifa: {
    allowNull: false,
    type: DataTypes.DECIMAL(5, 2)
  },
  anio: {
    allowNull: false,
    type: DataTypes.CHAR(4),
  },
  mes: {
    allowNull: false,
    type: DataTypes.CHAR(2),
  },
  nroSemana: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'nro_semana'
  },
  fechaEjecucion: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_ejecucion'
  },
  horas: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  produccion: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  costo: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  fechaReg: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_reg'
  },
  usuarioReg: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field:'usuario_reg'
  },
  fechaAct: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_act'
  },
  usuarioAct: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field:'usuario_act'
  },
  codServicio: {
    allowNull: false,
    type: DataTypes.INTEGER,
    /*references: {
      model: SERVICIO_TABLE,
      key: 'cod_servicio'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',*/
    field:'cod_servicio'
  },
  codColaborador: {
    allowNull: false,
    type: DataTypes.INTEGER,
    /*references: {
      model: COLABORADOR_TABLE,
      key: 'cod_colaborador'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',*/
    field:'cod_colaborador'
  }
}

class PlanificacionProduccion extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PLANIFICACION_PRODUCCION_TABLE,
      modelName: 'PlanificacionProduccion',
      timestamps: false
    }
  }
}

module.exports = { PlanificacionProduccion, PlanificacionProduccionSchema, PLANIFICACION_PRODUCCION_TABLE }
