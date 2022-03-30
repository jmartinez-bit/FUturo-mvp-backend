const { Model, DataTypes,Sequelize } = require('sequelize');
//const { OPCIONES_TABLE } = require('./opciones.model');

const OPCIONES_PERFILES_TABLE = 'opciones_perfiles';

const OpcionesPerfilesSchema = {
  codPerfil: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_perfil'
  },
  codOpciones: {
    allowNull: false,
    type: DataTypes.INTEGER,
    /*references: {
      model: OPCIONES_TABLE,
      key: 'cod_opciones'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',*/
    field:'cod_opciones'
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
    type: DataTypes.CHAR(1)
  }
}

class OpcionesPerfiles extends Model {

  static associate() {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: OPCIONES_PERFILES_TABLE,
      modelName: 'OpcionesPerfiles',
      timestamps: false
    }
  }
}

module.exports = { OpcionesPerfiles, OpcionesPerfilesSchema, OPCIONES_PERFILES_TABLE }
