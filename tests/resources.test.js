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

describe('GET /api/v1/resources/productividad/{codMapaRecurso}', () => {
  test('deberia obtener el contrato del colaborador', async () => {
    const response = await request(app)
      .get('/api/v1/resources/productividad/1')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual(
      expect.objectContaining({
        eficiencia: expect.any(String),
        rendimiento: expect.any(String),
        horas_servicio: expect.any(Number),
        licencias: expect.any(Number),
        faltas: expect.any(Number),
        vacaciones: expect.any(Number),
        horas_extras: expect.any(Number),
        total_horas_asignaciones: expect.any(Number),
        total_horas_facturables: expect.any(Number),
        capacity: expect.any(Number),
      })
    );
  });
});

afterAll(() => {
  sequelize.close();
  server.close();
});
