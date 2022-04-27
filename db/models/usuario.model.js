const { Model, DataTypes,Sequelize } = require('sequelize');
const { PERFIL_TABLE } = require('./perfil.model');

const USUARIO_TABLE = 'usuario';

const UsuarioSchema = {
  codUsuario: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_usuario'
  },
  usuario: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field:'usuario'
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field:'password'
  },
  codPerfil: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PERFIL_TABLE,
      key: 'cod_perfil'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field:'cod_perfil'
  },
  nombresApellidos: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'nombres_apellidos'
  },
  telefono: {
    allowNull: false,
    type: DataTypes.STRING(10),
    field:'telefono'
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
    type: DataTypes.CHAR(1)
  },
}

class Usuario extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USUARIO_TABLE,
      modelName: 'Usuario',
      timestamps: false
    }
  }
}

module.exports = { Usuario, UsuarioSchema, USUARIO_TABLE }
