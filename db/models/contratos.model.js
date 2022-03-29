const { Model, DataTypes, Sequelize } = require('sequelize');
const { COLABORADOR_TABLE } = require('./colaborador.model');

const CONTRATO_TABLE = 'contrato';

const ContratoSchema = {
  codContrato: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  codColaborador: {
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: COLABORADOR_TABLE,
      key: 'codColaborador'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  tipo: {
    allowNull: false,
    type: DataTypes.STRING(1),
  },
  modalidad: {
    allowNull: false,
    type: DataTypes.STRING(20),
  },
  indEps: {
    allowNull: false,
    type: DataTypes.STRING(1)
  },
  indSCTR: {
    allowNull: false,
    type: DataTypes.STRING(1)
  },
  indAsignFamiliar: {
    allowNull: false,
    type: DataTypes.STRING(1)
  },
  sueldoPlanilla: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  asignacionFamiliar: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  rxh: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  bono: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  eps: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  sctr: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  clm: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
  },
  indIndefinido: {
    allowNull: false,
    type: DataTypes.STRING(1)
  },
  fechaInicio: {
    allowNull: false,
    type: DataTypes.DATE
  },
  fechaFin: {
    allowNull: false,
    type: DataTypes.DATE
  },
  fechaCese: {
    allowNull: false,
    type: DataTypes.DATE
  },
  nroContratoAnt: {
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: CONTRATO_TABLE,
      key: 'codContrato'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  fechaReg: {
    allowNull: false,
    type: DataTypes.DATE
  },
  usuarioRegistro: {
    allowNull: false,
    type: DataTypes.STRING(10)
  },
  fechaAct: {
    allowNull: false,
    type: DataTypes.DATE
  },
  usuarioAct: {
    allowNull: false,
    type: DataTypes.STRING(10)
  },
  estado: {
    allowNull: false,
    type: DataTypes.CHAR(2)
  },
}

class Contrato extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONTRATO_TABLE,
      modelName: 'Contrato',
      timestamps: false
    }
  }
}

module.exports = { Contrato, ContratoSchema, CONTRATO_TABLE }
