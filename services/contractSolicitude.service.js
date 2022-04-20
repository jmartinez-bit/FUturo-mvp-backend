const sequelize = require('../libs/sequelize');
const SalaryBandService = require('../services/salaryBand.service');
const EpsService = require('../services/eps.service');

const salaryBandService = new SalaryBandService();
const epsService = new EpsService();

class ContractSolicitudeService{

  async createSolicitude(tipo_documento, nro_documento, nombre, ape_paterno,
    ape_materno, fecha_nacimiento, nro_celular, correo, direccion, distrito,provincia, cod_cliente, cod_linea_negocio, cod_puesto,
     nivel, modalidad, remuneracion, bono_men,cod_eps,eps_parcial_total, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional){

      //hallar el monto del eps
      if(cod_eps!=null){
        var monto_eps=await epsService.findAmount(cod_eps,eps_parcial_total);
        }else{
            monto_eps=0;
        }
      //calculo del clm
      var mod=modalidad.toLowerCase();
      var clm;
      if(mod==="planilla"){
        clm=(remuneracion)*process.env.FACTOR_PLANILLA+monto_eps;
      } else if(mod==="rxh"||mod==="practicante"){
        clm=remuneracion*process.env.FACTOR_RXH_PRACTICAS;
      }
      if(bono_men){
        clm+=parseFloat(bono_men);
      }
      if(ind_sctr==='S'){
        clm+=remuneracion*process.env.PORCENTAJE_SCTR;
        }
      //Se encuentra el cod_banda_salarial
      const [codBanda]=await salaryBandService.findSalaryBand(nivel,cod_puesto);
      const cod_banda_salarial=codBanda.cod_banda_salarial;
      //verificar si el clm está dentro de la banda salarial
      const maximo=await salaryBandService.findMax(cod_banda_salarial);
      if(clm<=maximo){
        var estado="Pendiente Aprobación";
      }else{
        estado="Pendiente Aprobación GG";
      }
      //Se acondiciona el numero de decimales de "clm"
      clm=clm.toFixed(2);

      if(bono_men){bono_men="'"+bono_men+"'";}
      if(cod_eps){cod_eps="'"+cod_eps+"'";}
      if(eps_parcial_total){eps_parcial_total="'"+eps_parcial_total+"'";}
      if(ind_sctr){ind_sctr="'"+ind_sctr+"'";}
      if(condicional_adicional){condicional_adicional="'"+condicional_adicional+"'";}


    const query=`INSERT INTO solicitud_contratacion (tipo_documento, nro_documento, nombre, ape_paterno, ape_materno,
     fecha_nacimiento, nro_celular, correo, direccion, distrito,provincia, cod_cliente, cod_linea_negocio, cod_puesto, nivel,
    cod_banda_salarial, modalidad, remuneracion, bono_men, cod_eps,eps_parcial_total, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional,clm,estado)
    VALUES ('${tipo_documento}','${nro_documento}','${nombre}','${ape_paterno}','${ape_materno}','${fecha_nacimiento}',
    '${nro_celular}','${correo}','${direccion}','${distrito}','${provincia}','${cod_cliente}','${cod_linea_negocio}','${cod_puesto}',
    '${nivel}',${cod_banda_salarial},'${modalidad}','${remuneracion}',${bono_men},${cod_eps},${eps_parcial_total},${ind_sctr},'${fecha_inicio}',
    '${fecha_fin}',${condicional_adicional},${clm},'${estado}');`;

    await sequelize.query(query);
  }

  async isThereAPreviousSolicitude(nroDocumento){
    const query=`SELECT TRUE
                WHERE EXISTS (SELECT 1
                              FROM solicitud_contratacion
                              WHERE nro_documento = '${nroDocumento}'); `;
    const [data] = await sequelize.query(query);
     return data;
  }

  async findBy(body){
    var query="SELECT * FROM solicitud_contratacion ";
    if(body.length!=0){
      query+="WHERE cod_solicitud_contratacion>0 ";
    }
    if(body.cod_cliente){
      query+=`AND cod_cliente = '${body.cod_cliente}' `;
    }
    if(body.cod_linea_negocio){
      query+=`AND cod_linea_negocio = '${body.cod_linea_negocio}' `;
    }
    if(body.nro_documento){
      query+=`AND nro_documento = '${body.nro_documento}' `;
    }
    if(body.nombre){
      const nombre=(body.nombre).toLowerCase();
      query+=`AND (lower(CONCAT(nombre,' ',ape_paterno,' ',ape_materno)) like '%${nombre}%') `
    }
    if(body.estado){
      query+=`AND estado = '${body.estado}'`;
    }
    query+=`;`;
    const [data] = await sequelize.query(query);
     return data;
  }
}

module.exports = ContractSolicitudeService;
