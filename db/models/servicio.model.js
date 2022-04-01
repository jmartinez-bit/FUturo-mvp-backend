const { Model, DataTypes,Sequelize } = require('sequelize');
const { LINEA_SERVICIO_TABLE } = require('./linea_servicio.model');

const SERVICIO_TABLE = 'servicio';

const ServicioSchema = {
  codServicio: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_servicio'
  },
  codCliente: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'cod_cliente'
  },
  codLineaServicio: {
    allowNull: false,
    type: DataTypes.STRING(10),
    references: {
      model: LINEA_SERVICIO_TABLE,
      key: 'cod_linea_servicio'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field:'cod_linea_servicio'
  },
  tipoServicio: {
    allowNull: false,
    type: DataTypes.STRING(5),
    field:'tipo_servicio'
  },
  descripcionServicio: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'descripcion_servicio'
  },
  fechaInicioProp: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_inicio_prop'
  },
  fechaFinProp: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_fin_prop'
  },
  horasVenta: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'horas_venta'
  },
  valorVenta: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    field:'valor_venta'
  },
  costoPropuesta: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    field:'costo_propuesta'
  },
  prodVenta: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    field:'prod_venta'
  },
  fechaIniPlanificada: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_ini_planificada'
  },
  fechaFinPlanificada: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_fin_planificada'
  },
  fechaIniReal: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_ini_real'
  },
  fechaFinReal: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_fin_real'
  },
  horasPlanificadas: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'horas_planificadas'
  },
  valorVentaPlanificada: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    field:'valor_venta_planificada'
  },
  costoPlanificada: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    field:'costo_planificada'
  },
  fechaReg: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_reg'
  },
  usuarioReg: {
    allowNull: false,
    type: DataTypes.STRING(10),
    field:'usuario_reg'
  },
  fechaAct: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_act'
  },
  usuarioAct: {
    allowNull: false,
    type: DataTypes.STRING(10),
    field:'usuario_act'
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
