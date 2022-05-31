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

describe('POST /api/v1/resources/resourcesmap', () => {
  test("deberia obtener todos los recursos del cliente '1' en el periodo '04-2022' ", async () => {
    const bodySend={
      cod_cliente:1,
      periodo:"04-2022"
    }
    const response = await request(app)
      .post('/api/v1/resources/resourcesmap')
      .set('authorization', auth.token)
      .send(bodySend)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            cod_mapa_recurso: expect.any(Number),
            cod_colaborador: expect.any(Number),
            linea_negocio: expect.any(String),
            estado: expect.any(String),
            nombre_perfil: expect.any(String),
            nivel: expect.any(String),
            fecha_inicio:expect.nullOrAny(String),
            fecha_fin: expect.nullOrAny(String),
            asignacion: expect.nullOrAny(Number),
            fecha_fin_contrato: expect.nullOrAny(String),
            clm_efectivo:expect.nullOrAny(String),
            produccion: expect.nullOrAny(String),
            productividad:expect.nullOrAny(String),
            nombre_colaborador:expect.any(String)
          })
        );
      });
    }


  });
});

describe('GET /api/v1/resources/periods', () => {
  test('deberia obtener todos los periodos con sus respectivos estados(I,A)', async () => {
    const response = await request(app)
      .get('/api/v1/resources/periods')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            periodo: expect.any(String),
            estado: expect.any(String),
          })
        );
      });
    }


  });
});

describe('GET /api/v1/resources/1/clients', () => {
  test("deberia obtener todos los clientes activos del usuario con codigo '1' ", async () => {
    const response = await request(app)
      .get('/api/v1/resources/1/clients')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            cod_cliente: expect.any(Number),
            nombre_corto: expect.any(String),
          })
        );
      });
    }

  });
});

describe('GET /api/v1/resources/profiles', () => {
  test('deberia obtener todos los perfiles activos', async () => {
    const response = await request(app)
      .get('/api/v1/resources/profiles')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            cod_perfil: expect.any(Number),
            nombre_perfil: expect.any(String),
          })
        );
      });
    }

  });
});

describe('POST /api/v1/resources/montoservicio', () => {
  test(`deberia calcular el monto del servicio de un determinado cliente`, async () => {
    const requestBody={
      cod_cliente : 1,
      periodo : "04-2022",
      perfil: 3,
      nombre: "ed"
    }
    const response =await request(app)
      .post('/api/v1/resources/montoservicio')
      .set('authorization', auth.token)
      .send(requestBody)
      .expect('Content-Type', /json/)
      .expect(200);

      if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            clm_efectivo: expect.any(String),
            produccion: expect.any(String),
            productividad: expect.any(String)
          })
        );
      });
    }
  });
});

describe('GET /api/v1/resources/:id_client/collaborators/:period', () => {
  test('deberia retornar todos los nombres y códigos de los colaboradores de un cliente en un periodo dado', async () => {
    const response = await request(app)
      .get('/api/v1/resources/1/collaborators/04-2022')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            cod_colaborador: expect.any(Number),
            nombres: expect.any(String),
            apellido_pat: expect.nullOrAny(String),
            apellido_mat: expect.nullOrAny(String)
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
