const express = require('express');
const ClientService = require('./../services/client.service');
const { checkApiKey, checkRoles } = require('../middlewares/auth.handler');

const router = express.Router();
const clientService = new ClientService();

// Obtener todos los clientes asignados a un dm
router.get('/user',
  checkApiKey,
  checkRoles('Delivery Manager', 'Jefe de Proyecto'),
  async (req, res, next) => {
  try {
    const codUsuario = req.headers['api'];
    const serviceLines = await clientService.findClientsJoinCarteraClienteByCodUsuario(codUsuario);
    res.json(serviceLines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
