const { Model, DataTypes,Sequelize } = require('sequelize');

const FERIADOS_TABLE = 'feriados';

const FeriadosSchema = {
  codFeriado: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_feriado'
  },
  annio: {
    allowNull: false,
    type: DataTypes.STRING(4),
  },
  fechaFeriado: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_feriado'
  }
}

class Feriados extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: FERIADOS_TABLE,
      modelName: 'Feriados',
      timestamps: false
    }
  }
}

module.exports = { Feriados, FeriadosSchema, FERIADOS_TABLE }
