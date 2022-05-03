const sequelize = require('../libs/sequelize');
const bcrypt = require('bcrypt');

class UserService{

  async findNames(cod_usuario){
    const query=`SELECT nombres_apellidos FROM usuario WHERE cod_usuario=${cod_usuario}; `;
    const [[data]] = await sequelize.query(query);
     return data.nombres_apellidos;
  }

  async created(){
    const query=`SELECT nombres_apellidos FROM usuario WHERE cod_usuario=${cod_usuario}; `;
    const [[data]] = await sequelize.query(query);
     return data.nombres_apellidos;
  }

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async findByEmail(email) {
    const query=`SELECT usuario, password FROM usuario WHERE usuario='${email}'; `;
    const [[rta]] = await sequelize.query(query);
    console.log("rta");
    console.log(rta);
    return rta;
  }

    //   const query=`SELECT nombres_apellidos FROM usuario WHERE usuario=${email}; `;
  //   const rta = await sequelize.User.findOne({
  //     where: { email }
  //   });
  //   return rta;
  // }

}

module.exports = UserService;
