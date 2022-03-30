const { Model, DataTypes } = require('sequelize');

const SEMANAS_TABLE = 'semanas';

const SemanasSchema = {
  annio: {
    allowNull: false,
    type: DataTypes.STRING(4),
  },
  nroSemana: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'nro_semana'
  },
  mes: {
    allowNull: false,
    type: DataTypes.STRING(3),
  },
  nroDiasUtiles: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'nro_dias_utiles'
  },
  horasXDia: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'horas_x_dia'
  },
  horasProductivas: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field:'horas_productivas'
  }
}

class Semanas extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SEMANAS_TABLE,
      modelName: 'Semanas',
      timestamps: false
    }
  }
}

module.exports = { Semanas, SemanasSchema, SEMANAS_TABLE }
