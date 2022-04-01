const { Model, DataTypes, Sequelize } = require('sequelize');
const { LINEA_SERVICIO_TABLE } = require('./linea-servicio.model');

const SERVICIO_TABLE = 'servicio';

const ServicioSchema = {
  codServicio: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  codCliente: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  codLineaServicio: {
    allowNull: false,
    type: DataTypes.STRING(10),
    references: {
      model: LINEA_SERVICIO_TABLE,
      key: 'codLineaServicio'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  tipoServicio: {
    allowNull: false,
    type: DataTypes.STRING(5),
  },
  descripcionServicio: {
    allowNull: false,
    type: DataTypes.STRING(100),
  },
  fechaInicioProp: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  fechaFinProp: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  horasVenta: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  valorVenta: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  costoPropuesta: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  prodVenta: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  fechaIniPlanificada: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  fechaFinPlanificada: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  fechaIniReal: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  fechaFinReal: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  horasPlanificadas: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  valorVentaPlanificada: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  costoPlanificada: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  fechaReg: {
    allowNull: false,
    type: DataTypes.DATE
  },
  usuarioReg: {
    allowNull: false,
    type: DataTypes.STRING(10)
  },
  fechaAct: {
    allowNull: false,
    type: DataTypes.DATE
  },
  usuarioAct: {
    allowNull: false,
    type: DataTypes.STRING(10)
  },
  estado: {
    allowNull: false,
    type: DataTypes.STRING(20)
  }
}

class Servicio extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SERVICIO_TABLE,
      modelName: 'Servicio',
      timestamps: false
    }
  }
}

module.exports = { Servicio, ServicioSchema, SERVICIO_TABLE }
