const sequelize = require('../libs/sequelize');

class UserService{

  async findNames(cod_usuario){
    const query=`SELECT nombres_apellidos FROM usuario WHERE cod_usuario=${cod_usuario}; `;
    const [[data]] = await sequelize.query(query);
     return data.nombres_apellidos;
  }

  async findByEmail(email) {
    const query=`SELECT cod_usuario, usuario, password, a.cod_perfil, REPLACE(UPPER(b.nombre_perfil), ' ', '_') AS nombre_perfil FROM usuario a INNER JOIN perfil b ON a.cod_perfil = b.cod_perfil WHERE usuario='${email}'; `;
    const [[rta]] = await sequelize.query(query);
    return rta;
  }

}

module.exports = UserService;
