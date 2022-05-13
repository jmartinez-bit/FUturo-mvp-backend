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

describe('GET /api/v1/resources/contrato/{codColaborador}/{periodo}', () => {
  test('deberia obtener el contrato del colaborador', async () => {
    const response = await request(app)
      .get('/api/v1/resources/contrato/1/03-2022')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual(
      expect.objectContaining({
        cod_colaborador: expect.any(Number),
        nro_documento: expect.any(String),
        nombres: expect.any(String),
        apellido_pat: expect.any(String),
        apellido_mat: expect.any(String),
        sueldo_planilla: expect.any(String),
        bono: expect.any(String),
        eps: expect.any(String),
        clm: expect.any(String),
        cod_contrato: expect.any(Number),
        modalidad: expect.any(String),
        fecha_fin: expect.any(String),
      })
    );
  });
});

afterAll(() => {
  sequelize.close();
  server.close();
});
