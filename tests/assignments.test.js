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

describe('GET /api/v1/resources/asignaciones/{cod_colaborador}/{periodo}/{cod_cliente}', () => {
  test('deberia obtener el listado de asignaciones de un colaborador asignado a un cliente dentro del rango de periodo', async () => {
    const response = await request(app)
      .get('/api/v1/resources/asignaciones/19/03-2022/12')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            tipo_servicio: expect.any(String),
            descripcion_servicio: expect.any(String),
            por_asignacion: expect.any(Number),
            fecha_inicio: expect.any(String),
            fecha_fin: expect.any(String),
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
