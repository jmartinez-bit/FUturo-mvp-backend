const sequelize = require('../libs/sequelize');

class AssignedHoursService{

  async findHoursPerDay(){
    const query=`SELECT valor_num_1 from parametro_negocio WHERE parametro='horas_dias'; `;
    const [[data]] = await sequelize.query(query);
     return data.valor;
  }

  async findNumberOfFeriados(fechaIni,fechaFin){
    const query=`SELECT COUNT(*) from feriado
                WHERE fecha_feriado BETWEEN to_date('${ fechaIni }', 'YYYY-MM-DD') AND to_date('${ fechaFin }', 'YYYY-MM-DD'); `;
    const [[data]] = await sequelize.query(query);
    const nroFeriados=parseFloat(Object.values(data));
    return nroFeriados;

  }

  async findAssignedHours(fechaIni,fechaFin,porcAsign){
    const nroFeriados=await this.findNumberOfFeriados(fechaIni,fechaFin);
    const workDays=countWorkDay(fechaIni,fechaFin)-nroFeriados;
    const hoursPerDay= await this.findHoursPerDay();
    const workHours=workDays*hoursPerDay*porcAsign/100;
    return workHours;
  }
}

function stringToDate(dateString){
  dateString = dateString.split('-');
  return new Date(dateString[0], dateString[1] - 1, dateString[2]);
}

function countWorkDay(fechaIniString,fechFinString){
  var fechaIni = stringToDate(fechaIniString), fechFin = stringToDate(fechFinString);
  var i = fechaIni.getDay(), f = fechFin.getDay();

  // Diferencia en días
  var diffDay = (fechFin - fechaIni) / (1000 * 60 * 60 * 24) + 1;
  var diffWeekDay = diffDay - (i ==0?1:8-i);

  // Se calcula cuantas semanas completas hay
  var weeks = Math.floor(diffWeekDay/7);

  // Si no hay ni una semana completa
  if (weeks <= 0) {
      return (f?f:6)-i+(i?1:0)+(f==6?-1:0);
  }else{
      return weeks*5 + (f==6?5:f) + ( i >= 1 && i <= 5 ? (6-i):0);
  }
}

module.exports = AssignedHoursService;
