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
const requestBody = {
  cod_mapa_recurso:667,
	opcion_renovacion:"mismas condiciones",
  fecha_fin_nuevo:"2024-01-01"
};

describe('POST /api/v1/renovation-request/create', () => {
  test('deberia crear una nueva solicitud de renovacion', async () => {
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN
    await request(app)
      .post('/api/v1/renovation-request/create')
      .set('authorization', auth.token)
      .send(requestBody)
      .expect('Content-Type', /json/)
      .expect(201);

      await sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  });
});

describe('GET /api/v1/renovation-request/auto/:cod', () => {
  test(`deberia autocompletar datos del contrato de un recurso dado su codigo en el mapa de recursos`, async () => {
    await request(app)
      .get('/api/v1/renovation-request/auto/667')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('POST /api/v1/renovation-request/reject/:cod', () => {
  test(`deberia rechazar una nueva solicitud de renovacion `, async () => {
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN

    const body={
      motivo_rechazo:"Motivo"
    }
    await request(app)
      .post('/api/v1/renovation-request/reject/27')
      .set('authorization', auth.token)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(200);

    await sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  });
});

describe('GET /api/v1/renovation-request/approve/:cod', () => {
  test("deberia aprobar una solicitud de renovacion,crear un nuevo contrato y actualizar maparecursos", async () => {
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN

    await request(app)
      .get('/api/v1/renovation-request/approve/27')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    await sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  });
});

afterAll(() => {
  sequelize.close();
  server.close();
});
