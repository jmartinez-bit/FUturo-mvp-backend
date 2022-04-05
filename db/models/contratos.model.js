const { Model, DataTypes } = require('sequelize');
const { COLABORADOR_TABLE } = require('./colaborador.model');

const CONTRATO_TABLE = 'contrato';

const ContratoSchema = {
  codContrato: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field: 'cod_contrato',
  },
  codColaborador: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: COLABORADOR_TABLE,
      key: 'cod_colaborador',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field: 'cod_colaborador',
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
    type: DataTypes.STRING(1),
    field: 'ind_eps',
  },
  indSCTR: {
    allowNull: false,
    type: DataTypes.STRING(1),
    field: 'ind_sctr',
  },
  indAsignFamiliar: {
    allowNull: false,
    type: DataTypes.STRING(1),
    field: 'ind_asign_familiar',
  },
  sueldoPlanilla: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    field: 'sueldo_planilla',
  },
  asignacionFamiliar: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    field: 'asignacion_familiar',
  },
  rxh: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  },
  bono: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  },
  eps: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  },
  sctr: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  },
  clm: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
  },
  indIndefinido: {
    allowNull: true,
    type: DataTypes.STRING(1),
    field: 'ind_indefinido',
  },
  fechaInicio: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'fecha_inicio',
  },
  fechaFin: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'fecha_fin',
  },
  fechaCese: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'fecha_cese',
  },
  nroContratoAnt: {
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: CONTRATO_TABLE,
      key: 'cod_contrato',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field: 'nro_contrato_ant',
  },
  fechaReg: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'fecha_reg',
  },
  usuarioRegistro: {
    allowNull: false,
    type: DataTypes.STRING(10),
    field: 'usuario_registro',
  },
  fechaAct: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'fecha_act',
  },
  usuarioAct: {
    allowNull: false,
    type: DataTypes.STRING(10),
    field: 'usuario_act',
  },
  estado: {
    allowNull: false,
    type: DataTypes.CHAR(2),
  },
};

class Contrato extends Model {
  static associate(models) {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: CONTRATO_TABLE,
      modelName: 'Contrato',
      timestamps: false,
    };
  }
}

module.exports = { Contrato, ContratoSchema, CONTRATO_TABLE };
