const sequelize = require('../libs/sequelize');

class UserService{

  async findUsername(cod_usuario){
    const query=`SELECT usuario FROM usuario WHERE cod_usuario=${cod_usuario}; `;
    const [[data]] = await sequelize.query(query);
     return data.usuario;
  }

  async findByEmail(email) {
    const query=`SELECT cod_usuario, usuario, password, a.cod_perfil, REPLACE(UPPER(b.nombre_perfil), ' ', '_') AS nombre_perfil, nombres_apellidos FROM usuario a INNER JOIN perfil b ON a.cod_perfil = b.cod_perfil WHERE usuario='${email}' and a.estado = 'A'; `;
    const [[rta]] = await sequelize.query(query);
    return rta;
  }

}

module.exports = UserService;
