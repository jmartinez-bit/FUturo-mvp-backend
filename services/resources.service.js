const sequelize = require('../libs/sequelize');
// const CollaboratorService = require('./collaborator.service');
// const AssignmentsService = require('./assignments.service');

function getSelect(attributes = '*') {
  return `SELECT ${ attributes.toString() } FROM mapa_recursos`;
};

// const collaboratorService = new CollaboratorService();
// const assignmentsService = new AssignmentsService();

class ResourcesService{

  constructor(){
    this.products=[]
  }

  async findByClientAndPeriod(cliente,periodo){
    const query="SELECT * FROM maparecursos WHERE cliente='"+cliente+"' AND periodo="+periodo+" ;";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findAll(){
    const query="SELECT * FROM maparecursos";
    const [data] = await sequelize.query(query);
    return data;
  }

  async findByResourceMapID(id) {
    // Columnas
    const select = getSelect(['mapa_recursos.eficiencia', 'mapa_recursos.rendimiento',
    'mapa_recursos.horas_servicio', 'mapa_recursos.licencias', 'mapa_recursos.faltas',
    'mapa_recursos.vacaciones', 'mapa_recursos.horas_extras', 'mapa_recursos.total_horas_asignaciones',
    'mapa_recursos.total_horas_facturables', 'mapa_recursos.capacity']);

    // Sentencia
    const query = `${ select } WHERE mapa_recursos.cod_mapa_recurso=${ id };`;

    const [[data]] = await sequelize.query(query);

    return data;
  }

}
module.exports = ResourcesService;
