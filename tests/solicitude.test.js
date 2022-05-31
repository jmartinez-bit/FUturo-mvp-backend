const sequelize = require('../libs/sequelize');
const request = require('supertest');
const { app, server } = require('../index');
const  nullOrAny  = require('./util.js');


// our global object for storing auth information
let auth = {};
expect.extend(nullOrAny);

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
});

describe('POST /api/v1/solicitude/', () => {
  test("deberia obtener todas las solicitudes según el parámetro de búsqueda ", async () => {
    const bodySend={
      nro_documento: "77456289",
      tipo_solicitud:"renovacion"
    }
    const response = await request(app)
      .post('/api/v1/solicitude/')
      .set('authorization', auth.token)
      .send(bodySend)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            tipo_solicitud: expect.any(String),
            cod_solicitud_renovacion: expect.any(Number),
            fecha_reg:expect.any(String),
            nombre_corto: expect.any(String),
            cod_linea_negocio: expect.any(String),
            puesto: expect.any(String),
            nivel: expect.any(String),
            nro_documento: expect.any(String),
            nombre_apellidos: expect.any(String),
            modalidad: expect.any(String),
            remuneracion: expect.any(String),
            bono_men: expect.nullOrAny(String),
            estado: expect.any(String),
            fecha_aprob: expect.nullOrAny(String),
            fecha_aprob_gg: expect.nullOrAny(String),
          })
        );
      });
    }


  });
});

describe('GET /api/v1/solicitude/:cod/renovacion', () => {
  test('deberia obtener el detalle de una solicitud dado su codigo y tipo, en este caso renovacion', async () => {
    const response = await request(app)
      .get('/api/v1/solicitude/16/renovacion')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            tipo_solicitud: expect.any(String),
            cod_solicitud_renovacion: expect.any(Number),
            nombre_corto: expect.any(String),
            nro_documento: expect.any(String),
            nombres: expect.any(String),
            apellido_pat: expect.any(String),
            apellido_mat: expect.any(String),
            opcion_renovacion: expect.any(String),
            nueva_modalidad: expect.any(String),
            nuevo_sueldo: expect.any(String),
            nuevo_bono: expect.any(String),
            nuevo_puesto: expect.any(String),
            nuevo_nivel_puesto: expect.any(String),
            cod_puesto: expect.any(Number),
            puesto: expect.any(String),
            nivel: expect.any(String),
            modalidad: expect.any(String),
            remuneracion: expect.any(String),
            bono_men: expect.nullOrAny(String),
            fecha_fin_ant: expect.any(String),
            fecha_inicio_nuevo: expect.any(String),
            fecha_fin_nuevo: expect.any(String),
            estado: expect.any(String),
            motivo_rechazo: expect.nullOrAny(String),
            cod_linea_negocio: expect.any(String),
            modalidad_bono: expect.nullOrAny(String),
            empresa: expect.any(String)
          })
        );
      });
    }


  });
});

describe('GET /api/v1/solicitude/:cod/contratacion', () => {
  test('deberia obtener el detalle de una solicitud dado su codigo y tipo, en este caso contratacion', async () => {
    const response = await request(app)
      .get('/api/v1/solicitude/16/contratacion')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([]));
    if (response.body.length > 0) {
      response.body.map((res) => {
        expect(res).toEqual(
          expect.objectContaining({
            tipo_solicitud: expect.any(String),
            cod_solicitud_contratacion: expect.any(Number),
            empresa: expect.any(String),
            tipo_documento: expect.any(String),
            nro_documento: expect.any(String),
            nombre: expect.any(String),
            ape_paterno: expect.any(String),
            ape_materno: expect.any(String),
            fecha_nacimiento: expect.any(String),
            nro_celular: expect.any(String),
            correo: expect.any(String),
            direccion: expect.any(String),
            distrito: expect.any(String),
            provincia: expect.any(String),
            nombre_corto: expect.any(String),
            cod_linea_negocio: expect.any(String),
            cod_puesto: expect.any(Number),
            puesto: expect.any(String),
            nivel: expect.any(String),
            cod_banda_salarial: expect.any(Number),
            modalidad: expect.any(String),
            remuneracion: expect.any(String),
            bono_men: expect.any(String),
            ind_asign_familiar: expect.nullOrAny(String),
            fecha_inicio: expect.any(String),
            fecha_fin: expect.any(String),
            condicional_adicional: expect.nullOrAny(String),
            estado: expect.any(String),
            condicion_proyecto_area: expect.nullOrAny(String),
            tarifa_mensual: expect.nullOrAny(String),
            productividad: expect.any(String),
            jefe_responsable_directo: expect.any(String),
            horario_laboral: expect.any(String),
            asignacion_equipo: expect.any(String),
            cv: expect.nullOrAny(String),
            motivo_rechazo: expect.nullOrAny(String),
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
