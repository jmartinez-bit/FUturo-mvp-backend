const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { config } = require('./../config/config');

const router = express.Router();

router.post('/login',
  passport.authenticate('local', {session: false}),
  async (req, res, next) => {
    try {
      const user = req.user;
      const payload = {
        id_sesion: user.cod_usuario,
        usuario: user.usuario,
        iduserprofile: user.cod_perfil,
        userProfile: user.nombre_perfil,
        nombre: user.nombres_apellidos        
      }
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn : '1800000' });
      res.json({
        token
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
