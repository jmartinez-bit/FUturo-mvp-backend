const sequelize = require('../libs/sequelize');

// Sentencias
function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM cliente`;
};

const joinCarteraCliente = `INNER JOIN cartera_cliente ON cliente.cod_cliente = cartera_cliente.cod_cliente`;

class ClientService{

  async findClientsJoinCarteraClienteByCodUsuario(codUsuario) {
    // Columnas
    const select = getSelect(['cliente.nombre_corto', 'cliente.cod_cliente']);

    // Sentencia
    const [data] = await sequelize.query(`${ select } ${ joinCarteraCliente }
                                          WHERE cartera_cliente.cod_usuario = ${ codUsuario };`);

    return data;
  }

  async findAll(){
    const query=`SELECT cod_cliente,nombre_corto FROM cliente WHERE estado='activo' ORDER BY nombre_corto ASC;`;
    const [data] = await sequelize.query(query);
     return data;
  }

}

module.exports = ClientService;
