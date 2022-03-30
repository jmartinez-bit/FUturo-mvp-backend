const { Model, DataTypes,Sequelize} = require('sequelize');
//const { USUARIO_TABLE } = require('./usuario.model');
//const { CLIENTE_TABLE } = require('./cliente.model');

const CARTERA_CLIENTE_TABLE = 'cartera_cliente';

const CarteraClienteSchema = {
  codUsuario: {
    allowNull: false,
    type: DataTypes.INTEGER,
    /*references: {
      model: USUARIO_TABLE,
      key: 'cod_usuario'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',*/
    field:'cod_usuario'
  },
  codCliente: {
    allowNull: false,
    type: DataTypes.INTEGER,
    /*references: {
      model: CLIENTE_TABLE,
      key: 'cod_cliente'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',*/
    field:'cod_cliente'
  },
  fechaAsignacion: {
    allowNull: false,
    type: DataTypes.DATE,
    field:'fecha_asignacion'
  },
  estado: {
    allowNull: false,
    type: DataTypes.CHAR(1)
  }
}

class CarteraCliente extends Model {

  static associate(models) {

  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CARTERA_CLIENTE_TABLE,
      modelName: 'CarteraCliente',
      timestamps: false
    }
  }
}

module.exports = { CarteraCliente, CarteraClienteSchema, CARTERA_CLIENTE_TABLE }
