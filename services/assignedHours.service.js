const sequelize = require('../libs/sequelize');
const { QueryTypes } = require('sequelize');


class AssignedHoursService{

  async findHoursPerDay(){
    const query=`SELECT valor_num_1 from parametro_negocio WHERE parametro='horas_dias'; `;
    const [[data]] = await sequelize.query(query);
     return data.valor_num_1;
  }

  async findNumberOfFeriados(fechaIni,fechaFin){
    const query=`SELECT COUNT(*) from feriado
                WHERE fecha_feriado BETWEEN to_date(?, 'YYYY-MM-DD') AND to_date(?, 'YYYY-MM-DD'); `;
    const [[data]] = await sequelize.query(query,{
      type: QueryTypes.SELECT,
      replacements: [fechaIni,
        fechaFin]
    });
  return parseFloat(Object.values(data));
  }

  async findAssignedHoursTotalAssignment(fechaIni,fechaFin){
    const nroFeriados=await this.findNumberOfFeriados(fechaIni,fechaFin);
    const workDays=countWorkDay(fechaIni,fechaFin)-nroFeriados;
    const hoursPerDay= await this.findHoursPerDay();
    return workDays*hoursPerDay;
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
  if(diffDay<=0){
    return -1;
  }
  else if(diffDay===1){
    if((i===0 && f===0)||(i===6 && f===6)){
      return 0;
    }else{
    return 1;
    }
  }else if(diffDay<=7){
    if(f===6 && i===0){
      return 5;
    }else if(f===0 && i===6){
      return 0;
    }else if(i===0 || i===6){
      return f;
    }else if(f===0 || f===6){
      return 6-i;
    }else if(f>i){
      return f-i+1;
    }else{
      return 6-i+f;
    }

  }else  if (weeks === 0 ) {
      if(i===0||i===6){
        return 5;
      }else if(f===0||f===6){
        return 11-i;
      }else{
        return 6-i+f;
      }
  }else{
      return weeks*5 + (f==6?5:f) + ( i >= 1 && i <= 5 ? (6-i):0);
  }
}

module.exports = AssignedHoursService;
