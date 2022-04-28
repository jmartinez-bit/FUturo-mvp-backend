const sequelize = require('../libs/sequelize');

class UserService{

  async findNames(cod_usuario){
    const query=`SELECT nombres_apellidos FROM usuario WHERE cod_usuario=${cod_usuario}; `;
    const [[data]] = await sequelize.query(query);
     return data.nombres_apellidos;
  }

}

module.exports = UserService;
