const { Model, DataTypes, Sequelize } = require('sequelize');
const { AREA_TABLE } = require('./area.model');
const { PUESTO_TABLE } = require('./puesto.model');
const COLABORADOR_TABLE = 'colaborador';

const ColaboradorSchema = {
  codColaborador: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  tipoDoc: {
    allowNull: false,
    type: DataTypes.STRING(10),
  },
  nroDocumento: {
    allowNull: false,
    type: DataTypes.STRING(15)
  },
  codPuesto: {
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: PUESTO_TABLE,
      key: 'codPuesto'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  nivel: {
    allowNull: false,
    type: DataTypes.STRING(20)
  },
  codArea: {
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: AREA_TABLE,
      key: 'codArea'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  nombres: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  apellidoMat: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  apellidoPat: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  fechaNacimiento: {
    allowNull: false,
    type: DataTypes.DATE
  },
  correoPersonal: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  correoTrabajo: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  celularPersonal: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  celularTrabajo: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  fechaReg: {
    allowNull: false,
    type: DataTypes.DATE
  },
  fechaAct: {
    allowNull: false,
    type: DataTypes.DATE
  },
  fechaCese: {
    allowNull: false,
    type: DataTypes.DATE
  },
  sexo: {
    allowNull: false,
    type: DataTypes.STRING(1)
  },
  usuarioReg: {
    allowNull: false,
    type: DataTypes.STRING(20)
  },
  usuarioAct: {
    allowNull: false,
    type: DataTypes.STRING(20)
  },
  estado: {
    allowNull: false,
    type: DataTypes.STRING(1)
  },

}

class Colaborador extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: COLABORADOR_TABLE,
      modelName: 'Colaborador',
      timestamps: false
    }
  }
}

module.exports = { Colaborador, ColaboradorSchema, COLABORADOR_TABLE }
