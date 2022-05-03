const { Strategy } = require('passport-local');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const UserService = require('./../../../services/user.service');
const service = new UserService();

const LocalStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      console.log("findByEmail");
      const user = await service.findByEmail(email);
      console.log(!user);
      console.log("pasamos por if");
      if (!user) {
        done(boom.unauthorized(), false);
      }
      console.log("si existe usuario");
      console.log(password);
      console.log(user.password);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        done(boom.unauthorized(), false);
      }
      console.log("si hizo match");
      delete user.password;
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports = LocalStrategy;