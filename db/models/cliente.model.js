const { Model, DataTypes, Sequelize } = require('sequelize');

const CLIENTE_TABLE = 'cliente';

const ClienteSchema = {
  codCliente: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_cliente'
  },
  ruc: {
    allowNull: false,
    type: DataTypes.STRING(10),
    field:'ruc'
  },
  razonSocial: {
    allowNull: false,
    type: DataTypes.STRING(150),
    field:'razon_social'
  },
  nombreCorto: {
    allowNull: false,
    type: DataTypes.STRING(50),
    field:'nombre_corto'
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
  estado: {
    allowNull: false,
    type: DataTypes.STRING(20),
  },
}

class Cliente extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CLIENTE_TABLE,
      modelName: 'Cliente',
      timestamps: false
    }
  }
}

module.exports = { Cliente, ClienteSchema, CLIENTE_TABLE }
