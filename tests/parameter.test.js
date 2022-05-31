const sequelize = require('../libs/sequelize');
const request = require('supertest');
const { app, server } = require('../index');
const  nullOrAny  = require('./util.js');


// our global object for storing auth information
let auth = {};
expect.extend(nullOrAny);

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

describe('GET /api/v1/parameter/:nombreParametro', () => {
  test('deberia obtener los valores del parámetro ', async () => {
    const response = await request(app)
      .get('/api/v1/parameter/factor_planilla')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            valor_num_1: expect.nullOrAny(String),
            valor_num_2: expect.nullOrAny(String),
            valor_num_3: expect.nullOrAny(String),
            valor_char_1: expect.nullOrAny(String),
            valor_char_2: expect.nullOrAny(String),
            valor_char_3: expect.nullOrAny(String)
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
