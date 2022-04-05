const { Model, DataTypes,Sequelize} = require('sequelize');
const { AREA_TABLE } = require('./area.model');
const { PUESTO_TABLE } = require('./puesto.model');
const COLABORADOR_TABLE = 'colaborador';

const ColaboradorSchema = {
  codColaborador: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
    field:'cod_colaborador'
  },
  nroDocumento: {
    allowNull: false,
    type: DataTypes.STRING(15),
    field:'nro_documento'
  },
  codPuesto: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PUESTO_TABLE,
      key: 'cod_puesto'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field: 'cod_puesto',
  },
  nivel: {
    allowNull: false,
    type: DataTypes.STRING(20),
  },
  codArea: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: AREA_TABLE,
      key: 'cod_area'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    field:'cod_area'
  },
  nombres: {
    allowNull: false,
    type: DataTypes.STRING(100),
  },
  apellidoMat: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'apellido_mat'
  },
  apellidoPat: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'apellido_pat'
  },
  fechaNacimiento: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_nacimiento'
  },
  correoPersonal: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'correo_personal'
  },
  correoTrabajo: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'correo_trabajo'
  },
  celularPersonal: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'celular_personal'
  },
  celularTrabajo: {
    allowNull: false,
    type: DataTypes.STRING(100),
    field:'celular_trabajo'
  },
  fechaReg: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_reg'
  },
  fechaAct: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_act'
  },
  fechaCese: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_cese'
  },
  sexo: {
    allowNull: false,
    type: DataTypes.STRING(1),
  },
  usuarioReg: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field:'usuario_reg'
  },
  usuarioAct: {
    allowNull: false,
    type: DataTypes.STRING(20),
    field:'usuario_act'
  },
  estado: {
    allowNull: false,
    type: DataTypes.STRING(1),
  },
};

class Colaborador extends Model {
  static associate(models) {
    this.hasMany(models.MapaRecurso, {
      as: 'mapaRecursos',
      foreignKey: 'codColaborador',
    });
    this.belongsToMany(models.Servicio, {
      as: 'servicios',
      through: models.AsignacionRecurso,
      foreignKey: 'codColaborador',
      otherKey: 'codServicio',
    });
    this.hasMany(models.AsignacionRecurso, {
      as: 'asignaciones',
      foreignKey: 'codColaborador',
    });
    this.hasMany(models.Contrato, {
      as: 'contratos',
      foreignKey: 'codColaborador',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: COLABORADOR_TABLE,
      modelName: 'Colaborador',
      timestamps: false,
    };
  }
}

module.exports = { Colaborador, ColaboradorSchema, COLABORADOR_TABLE };
