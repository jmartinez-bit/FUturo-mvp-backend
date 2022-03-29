const { Model, DataTypes, Sequelize } = require('sequelize');
const { COLABORADOR_TABLE } = require('./colaborador.model');

const PERIODO_TABLE = 'periodo';

const PeriodoSchema = {
  periodo: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
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
  estado: {
    allowNull: false,
    type: DataTypes.STRING(1)
  },
}

class Periodo extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PERIODO_TABLE,
      modelName: 'Periodo',
      timestamps: false
    }
  }
}

module.exports = { Periodo, PeriodoSchema, PERIODO_TABLE }
