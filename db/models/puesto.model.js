const { Model, DataTypes, Sequelize } = require('sequelize');

const PUESTO_TABLE = 'puesto';

const PuestoSchema = {
  codPuesto: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  puesto: {
    allowNull: false,
    type: DataTypes.STRING(100),
  },
  estado: {
    allowNull: false,
    type: DataTypes.STRING(1)
  }
}

class Puesto extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PUESTO_TABLE,
      modelName: 'Puesto',
      timestamps: false
    }
  }
}

module.exports = { Puesto, PuestoSchema, PUESTO_TABLE }
