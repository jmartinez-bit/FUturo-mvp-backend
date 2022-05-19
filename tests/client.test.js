const sequelize = require('../libs/sequelize');
const request = require('supertest');
const { app, server } = require('../index');

// our global object for storing auth information
let auth = {};

beforeAll(async () => {
  /**
   * Usuario: luis.kitayama@mdp.com.pe
   * Perfil: DELIVERY_MANAGER
   */
  const response = await request(app).post('/api/v1/auth/login').send({
    email: 'luis.kitayama@mdp.com.pe',
    password: '123456',
  });

  auth.token = `Bearer ${response.body.token}`;
});

describe('GET /api/v1/clients/user', () => {
  test('deberia obtener el listado de clientes de un delivery manager', async () => {
    const response = await request(app)
      .get('/api/v1/clients/user')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map(res => {
        expect(res).toEqual(
          expect.objectContaining({
            nombre_corto: expect.any(String),
            cod_cliente: expect.any(Number)
          })
        );
      });
    }
  });
});

afterAll(() => {
  sequelize.close();
  server.close();
});
