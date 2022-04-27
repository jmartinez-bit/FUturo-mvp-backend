const { Model, DataTypes,Sequelize } = require('sequelize');

const PERFIL_TABLE = 'perfil';

const PerfilSchema = {
  codPerfil: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_perfil'
  },
  nombrePerfil: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field:'nombre_perfil'
  },
  estado: {
    allowNull: false,
    type: DataTypes.CHAR(1)
  },
}

class Perfil extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PERFIL_TABLE,
      modelName: 'Perfil',
      timestamps: false
    }
  }
}

module.exports = { Perfil, PerfilSchema, PERFIL_TABLE }
