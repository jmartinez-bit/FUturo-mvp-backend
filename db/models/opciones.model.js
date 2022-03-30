const { Model, DataTypes, Sequelize } = require('sequelize');

const OPCIONES_TABLE = 'opciones';

const OpcionesSchema = {
  codOpciones: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_opciones'
  },
  modulo: {
    allowNull: false,
    type: DataTypes.STRING(100),
  },
  nombreOpcion: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'nombre_opcion'
  },
  urlOpcion: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'url_opcion'
  },
  estado: {
    allowNull: false,
    type: DataTypes.CHAR(1)
  }
}

class Opciones extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: OPCIONES_TABLE,
      modelName: 'Opciones',
      timestamps: false
    }
  }
}

module.exports = { Opciones, OpcionesSchema, OPCIONES_TABLE }
