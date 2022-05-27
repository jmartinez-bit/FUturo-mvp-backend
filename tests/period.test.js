const sequelize = require('../libs/sequelize');
const request = require('supertest');
const { app, server } = require('../index');

// our global object for storing auth information
let auth = {};

const addCero = (number) => {
  return number < 10 ? '0'.concat(number) : number;
};

const getPeriod = (periodo) => {
  const month = parseInt(periodo.substring(0, 2));
  const year = parseInt(periodo.substr(3));
  const newPeriod = `${month === 12 ? '01' : addCero(month + 1)}-${
    month === 12 ? year + 1 : year
  }`;
  return { periodo: newPeriod, tasa_cambio: 3.77 };
};

beforeAll(async () => {
  /**
   * Usuario: johanna.landa@mdp.com.pe
   * Perfil: JEFE_DE_RECURSOS_HUMANOS
   */
  const response = await request(app).post('/api/v1/auth/login').send({
    email: 'johanna.landa@mdp.com.pe',
    password: '123456',
  });

  auth.token = `Bearer ${response.body.token}`;
  await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN
});

describe('GET /api/v1/period', () => {
  test('deberia obtener el listado de periodos', async () => {
    const response = await request(app)
      .get('/api/v1/period')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            periodo: expect.any(String),
            tasa_cambio: expect.any(String),
            fecha_apertura: expect.any(String),
            estado: expect.any(String),
          })
        );
      });
    }
  });
});

describe('GET /api/v1/period/last-period', () => {
  test('deberia obtener el ultimo periodo con la tasa de cambio', async () => {
    const response = await request(app)
      .get('/api/v1/period/last-period')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual(
      expect.objectContaining({
        periodo: expect.any(String),
        tasa_cambio: expect.any(String),
      })
    );
  });
});

describe('POST /api/v1/period/create', () => {
  test('deberia crear el periodo', async () => {
    const lastPeriod = await request(app)
      .get('/api/v1/period/last-period')
      .set('authorization', auth.token);
    const newPeriod = getPeriod(lastPeriod.body.periodo);
    await request(app)
      .post('/api/v1/period/create')
      .set('authorization', auth.token)
      .send(newPeriod)
      .expect('Content-Type', /json/)
      .expect(201);
  });
});

describe('PUT /api/v1/period/update', () => {
  test('deberia actualizar el ultimo periodo activo', async () => {
    const response = await request(app)
      .put('/api/v1/period/update')
      .set('authorization', auth.token)
      .send({ tasa_cambio: 3.5 })
      .expect('Content-Type', /json/)
      .expect(200);

    const lastPeriod = await request(app)
      .get('/api/v1/period/last-period')
      .set('authorization', auth.token);

    expect(response.body.tasa_cambio).toEqual(lastPeriod.body.tasa_cambio);
  });
});

afterAll(() => {
  sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  sequelize.close();
  server.close();
});
