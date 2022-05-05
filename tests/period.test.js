const sequelize = require('../libs/sequelize');
const request = require('supertest');
const { app, server } = require('../index');

// our global object for storing auth information
let auth = {};

const addCero = (number) => {
  return number < 10 ? '0'.concat(number) : number;
}

const getPeriod = (periodo) => {
  const month = parseInt(periodo.substring(0, 2));
  const year = parseInt(periodo.substr(3));
  const newPeriod = `${ month === 12 ? '01' : addCero(month + 1) }-${ month === 12 ? year + 1 : year }`;
  return { periodo: newPeriod, tasa_cambio: 3.77 };
}

beforeAll( async () => {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email: "luis.kitayama@mdp.com.pe",
      password: "123456"
    });

  auth.token = `Bearer ${ response.body.token }`;
});

describe("GET /api/v1/period", () => {
  test('deberia obtener el listado de periodos (los ultimos 6 periodos)', async () => {
    const response = await request(app)
      .get('/api/v1/period')
      .set("authorization", auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    expect(response.body.length).toBeLessThanOrEqual(6);
  });
});

describe("GET /api/v1/period/last-period", () => {
  test('deberia obtener el ultimo periodo con la tasa de cambio', async () => {
    const response = await request(app)
      .get('/api/v1/period/last-period')
      .set("authorization", auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Object);
  });
});

describe("POST /api/v1/period/create", () => {
  test('deberia crear el periodo', async () => {
    const lastPeriod = await request(app).get('/api/v1/period/last-period')
      .set("authorization", auth.token);
    const newPeriod = getPeriod(lastPeriod.body.periodo);
    await request(app).post('/api/v1/period/create')
      .set("authorization", auth.token)
      .send(newPeriod)
      .expect('Content-Type', /json/)
      .expect(201);
  });
});

describe("PUT /api/v1/period/update", () => {
  test('deberia actualizar el ultimo periodo activo', async () => {
    const response = await request(app).put('/api/v1/period/update')
      .set("authorization", auth.token)
      .send({tasa_cambio: 3.5})
      .expect('Content-Type', /json/)
      .expect(200);

    const lastPeriod = await request(app).get('/api/v1/period/last-period')
      .set("authorization", auth.token);

    expect(response.body.tasa_cambio).toEqual(lastPeriod.body.tasa_cambio);
  });
});

afterAll(() => {
  sequelize.close();
  server.close();
});
