const sequelize = require('../libs/sequelize');
const SalaryBandService = require('../services/salaryBand.service');
const EpsService = require('../services/eps.service');

const salaryBandService = new SalaryBandService();
const epsService = new EpsService();

class ContractSolicitudeService{

  async createSolicitude(tipo_documento, nro_documento, nombre, ape_paterno,
    ape_materno, fecha_nacimiento, nro_celular, correo, direccion, distrito,provincia, cod_cliente, cod_linea_negocio, cod_puesto,
     nivel, modalidad, remuneracion, bono_men,cod_eps, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional){

      //hallar el monto del eps
      if(cod_eps!=null){
        var monto_eps=await epsService.findAmount(cod_eps);
        }else{
            monto_eps=0;
        }
      //calculo del clm
      const asig_familiar=0;
      var clm=(remuneracion+asig_familiar)*1.47+monto_eps;
      if(ind_sctr){
        clm+=remuneracion*0.14;
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
      if(ind_sctr){ind_sctr="'"+ind_sctr+"'";}
      if(condicional_adicional){condicional_adicional="'"+condicional_adicional+"'";}


    const query=`INSERT INTO solicitud_contratacion (tipo_documento, nro_documento, nombre, ape_paterno, ape_materno,
     fecha_nacimiento, nro_celular, correo, direccion, distrito,provincia, cod_cliente, cod_linea_negocio, cod_puesto, nivel,
    cod_banda_salarial, modalidad, remuneracion, bono_men, cod_eps, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional,clm,estado)
    VALUES ('${tipo_documento}','${nro_documento}','${nombre}','${ape_paterno}','${ape_materno}','${fecha_nacimiento}',
    '${nro_celular}','${correo}','${direccion}','${distrito}','${provincia}','${cod_cliente}','${cod_linea_negocio}','${cod_puesto}',
    '${nivel}',${cod_banda_salarial},'${modalidad}','${remuneracion}',${bono_men},${cod_eps},${ind_sctr},'${fecha_inicio}',
    '${fecha_fin}',${condicional_adicional},${clm},'${estado}');`;

    await sequelize.query(query);
  }

}

module.exports = ContractSolicitudeService;
