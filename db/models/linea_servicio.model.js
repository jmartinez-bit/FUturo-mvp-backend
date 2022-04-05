const { Model, DataTypes } = require('sequelize');

const LINEA_SERVICIO_TABLE = 'linea_servicio';

const LineaServicioSchema = {
  codLineaServicio: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING(10),
    field:'cod_linea_servicio'
  },
  lineaServicio: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'linea_servicio'
  },
  estado: {
    allowNull: false,
    type: DataTypes.STRING(1)
  },
  box: {
    allowNull: false,
    type: DataTypes.STRING(4)
  }
}

class LineaServicio extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: LINEA_SERVICIO_TABLE,
      modelName: 'LineaServicio',
      timestamps: false
    }
  }
}

module.exports = { LineaServicio, LineaServicioSchema, LINEA_SERVICIO_TABLE }
