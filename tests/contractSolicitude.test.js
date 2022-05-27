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

describe('POST /api/v1/contractSolicitude/newSolicitude', () => {
  test('deberia crear una nueva solicitud de contratacion', async () => {
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN
    const requestBody = {
      empresa:"MDP",
      tipo_documento:"DNI",
      nro_documento:"00000001",
      nombre:"Adan",
      ape_paterno:"Saquiray",
      ape_materno:"Delgado",
      fecha_nacimiento:"1999-06-09",
      sexo:"M",
      nro_celular:999999999,
      correo:"josue@gmail.com",
      direccion:"Lomas 123",
      distrito:"SJL",
      provincia:"Lima",
      cod_cliente:1,
      cod_linea_negocio:"SWF",
      cod_puesto:23,
      nivel:"Junior",
      modalidad:"planilla",
      remuneracion:100,
      bono_men:"200",
      fecha_inicio:"2022-04-01",
      fecha_fin:"2021-12-31",
      condicional_adicional:"Si peru va al mundial 500 soles mas",
      condicion_proyecto_area:"Nuevo Proyecto",
      tarifa_mensual:"1800.00",
      jefe_responsable_directo:"Pedro Castillo",
      horario_laboral:"Lunes a Viernes 9am a 7 pm",
      asignacion_equipo:"Planilla"
    };
    await request(app)
      .post('/api/v1/contractSolicitude/newSolicitude')
      .set('authorization', auth.token)
      .send(requestBody)
      .expect('Content-Type', /json/)
      .expect(201);

      await sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  });
});

afterAll(() => {
  sequelize.close();
  server.close();
});
