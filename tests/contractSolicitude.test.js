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
  cod_linea_negocio:"ATIS",
  cod_puesto:23,
  nivel:"Junior",
  modalidad:"planilla",
  remuneracion:1000,
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

describe('POST /api/v1/contractSolicitude/newSolicitude', () => {
  test('deberia crear una nueva solicitud de contratacion', async () => {
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN
    await request(app)
      .post('/api/v1/contractSolicitude/newSolicitude')
      .set('authorization', auth.token)
      .send(requestBody)
      .expect('Content-Type', /json/)
      .expect(201);

      await sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  });
});

describe('GET /api/v1/contractSolicitude/approve/:cod/true', () => {
  test(`deberia aprobar una nueva solicitud de contratacion crear un nuevo contrato,
   crear un nuevo colaborador y crear un nuevo recurso en el mapa de recursos`, async () => {
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN

    await request(app)
      .get('/api/v1/contractSolicitude/approve/17/true')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    await sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  });
});

describe('POST /api/v1/contractSolicitude/reject/:cod', () => {
  test(`deberia rechazar una nueva solicitud de contratacion `, async () => {
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN
    const body={
      motivo_rechazo:"Motivo"
    }
    await request(app)
      .post('/api/v1/contractSolicitude/reject/17')
      .set('authorization', auth.token)
      .send(body)
      .expect('Content-Type', /json/)
      .expect(200);

    await sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  });
});

describe('GET /api/v1/contractSolicitude/approvegg/:cod', () => {
  test("deberia aprobar cambiar el estado de una solicitud de contratacion de 'Pendiente Aprobacion' a 'Pendiente Aprobacion GG'", async () => {
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN

    await request(app)
      .get('/api/v1/contractSolicitude/approvegg/21')
      .set('authorization', auth.token)
      .expect('Content-Type', /json/)
      .expect(200);

    await sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  });
});

describe('POST /api/v1/contractSolicitude/edit/:cod', () => {
  test("deberia editar una solicitud de contratacion ", async () => {
    await sequelize.query(`BEGIN;`);//INICIO DE LA TRANSACCIÓN
    const bodySend={
      empresa:"MDP",
      tipo_documento:"DNI",
      nro_documento:"31415953",
      nombre:"EDITADO",
      ape_paterno:"EDITADO",
      ape_materno:"EDITADO",
      fecha_nacimiento:"1999-06-09",
      sexo:"M",
      nro_celular:997257355,
      correo:"josue@gmail.com",
      direccion:"mangomarca mzB Lte 15",
      distrito:"SJL",
      provincia:"Lima"
    }
    await request(app)
      .post('/api/v1/contractSolicitude/edit/21')
      .set('authorization', auth.token)
      .send(bodySend)
      .expect('Content-Type', /json/)
      .expect(200);

    await sequelize.query(`ROLLBACK;`);//FIN DE LA TRANSACCIÓN
  });
});

afterAll(() => {
  sequelize.close();
  server.close();
});
