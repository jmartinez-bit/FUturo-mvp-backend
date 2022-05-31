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

describe('GET /api/v1/salaryBand/:cod_puesto/:nivel', () => {
  test('deberia obtener los montos de un salario de acuerdo al cod_puesto y al nivel', async () => {
    const response = await request(app)
      .get('/api/v1/salaryBand/23/junior')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            cod_banda_salarial: expect.any(Number),
            minimo: expect.any(String),
            maximo: expect.any(String)
          })
        );
      });
    }


  });
});

describe('GET /api/v1/salaryBand/:cod_puesto/:nivel', () => {
  test('deberia obtener un error porque no hay un salario para este cod_puesto y al nivel', async () => {
    const response = await request(app)
      .get('/api/v1/salaryBand/23/asdaf')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(409);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            error: expect(true),
	          message: expect.any(String)
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
