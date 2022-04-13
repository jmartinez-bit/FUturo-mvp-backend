const express = require('express');
const ClientService = require('./../services/client.service');

const router = express.Router();
const clientService = new ClientService();

// Obtener todas las lineas de servicio
// TODO: Obtener codigo de usuario por header
router.get('/user/:codUsuario', async (req, res, next) => {
  try {
    const { codUsuario } = req.params;
    const serviceLines = await clientService.findClientsJoinCarteraClienteByCodUsuario(codUsuario);
    res.json(serviceLines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
