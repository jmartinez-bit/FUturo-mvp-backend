const { Model, DataTypes,Sequelize} = require('sequelize');

const AREA_TABLE = 'area';

const AreaSchema = {
  codArea: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_area'
  },
  area: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  estado: {
    allowNull: false,
    type: DataTypes.STRING(1)
  }
}

class Area extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: AREA_TABLE,
      modelName: 'Area',
      timestamps: false
    }
  }
}

module.exports = { Area, AreaSchema, AREA_TABLE }
