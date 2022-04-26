const sequelize = require('../libs/sequelize');
const SalaryBandService = require('../services/salaryBand.service');
const EpsService = require('../services/eps.service');
const CollaboratorService = require('../services/collaborator.service');
const ContractService = require('../services/contract.service');
const ResourcesService = require('../services/resources.service');



const salaryBandService = new SalaryBandService();
const epsService = new EpsService();
const collaboratorService = new CollaboratorService();
const contractService = new ContractService();
const resourcesService = new ResourcesService();



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
        var estado="Pendiente Aprobacion";
      }else{
        estado="Pendiente Aprobacion GG";
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
    cod_banda_salarial, modalidad, remuneracion, bono_men, cod_eps,eps_parcial_total, ind_sctr, fecha_inicio, fecha_fin, condicional_adicional,clm,estado,fecha_reg)
    VALUES ('${tipo_documento}','${nro_documento}','${nombre}','${ape_paterno}','${ape_materno}','${fecha_nacimiento}',
    '${nro_celular}','${correo}','${direccion}','${distrito}','${provincia}','${cod_cliente}','${cod_linea_negocio}','${cod_puesto}',
    '${nivel}',${cod_banda_salarial},'${modalidad}','${remuneracion}',${bono_men},${cod_eps},${eps_parcial_total},${ind_sctr},'${fecha_inicio}',
    '${fecha_fin}',${condicional_adicional},${clm},'${estado}',CURRENT_DATE);`;

    await sequelize.query(query);
  }

  async isThereAPreviousSolicitude(nroDocumento){
    const query=`SELECT TRUE
                WHERE EXISTS (SELECT 1
                              FROM solicitud_contratacion
                              WHERE nro_documento = '${nroDocumento}' AND estado<>'Rechazado'); `;
    const [data] = await sequelize.query(query);
     return data;
  }

  async findBy(body){
    var query=`SELECT cod_solicitud_contratacion,solicitud_contratacion.fecha_reg,cliente.nombre_corto,cod_linea_negocio,puesto.puesto,nivel,nro_documento,
    CONCAT(nombre,' ',ape_paterno,' ',ape_materno) AS nombre_apellidos,modalidad,remuneracion,bono_men,cod_eps,
    ind_sctr,solicitud_contratacion.estado,fecha_aprob,ind_aprobacion_gg,fecha_aprob_gg
    FROM solicitud_contratacion
    INNER JOIN cliente ON solicitud_contratacion.cod_cliente=cliente.cod_cliente
    INNER JOIN puesto ON solicitud_contratacion.cod_puesto=puesto.cod_puesto `;
    if(body.length!=0){
      query+="WHERE cod_solicitud_contratacion>0 ";
    }
    if(body.cod_cliente){
      query+=`AND solicitud_contratacion.cod_cliente = '${body.cod_cliente}' `;
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
      query+=`AND solicitud_contratacion.estado = '${body.estado}'`;
    }
    query+=`ORDER BY cod_solicitud_contratacion DESC;`;
    const [data] = await sequelize.query(query);
     return data;
  }

  async findOne(cod){
    const query1=`SELECT cod_solicitud_contratacion,tipo_documento,nro_documento,nombre,ape_paterno,ape_materno,fecha_nacimiento,
              nro_celular,correo,direccion,distrito,provincia,nombre_corto,cod_linea_negocio,solicitud_contratacion.cod_puesto,
              puesto,nivel,cod_banda_salarial,modalidad,remuneracion,bono_men,cod_eps,
              eps_parcial_total, ind_sctr,ind_asign_familiar,fecha_inicio,fecha_fin,condicional_adicional,solicitud_contratacion.estado
                 FROM solicitud_contratacion
                 INNER JOIN cliente ON solicitud_contratacion.cod_cliente=cliente.cod_cliente
                 INNER JOIN puesto ON solicitud_contratacion.cod_puesto=puesto.cod_puesto
                 WHERE cod_solicitud_contratacion=${cod} ;`;
    var [data1] = await sequelize.query(query1);
    const codEps=data1[0].cod_eps;
  //Se verifica si el campo cod_eps está lleno
    if(codEps){
    const query2=`SELECT plan_eps FROM eps
                  WHERE cod_eps=${codEps} ;`;
    const [data2] = await sequelize.query(query2);
  //Se añade el campo plan_eps
    data1=[{
      ...data1[0],
      ...data2[0]
    }]
  }

    return data1;
  }

  async findState(cod){
    const query=`SELECT estado FROM solicitud_contratacion
                 WHERE cod_solicitud_contratacion=${cod}`;
    const [data]=await sequelize.query(query);
    return data[0].estado;
  }

  async approve(cod,indAsignFamiliar,codUsuario){
    if(indAsignFamiliar==="true"){
      const [data]=await sequelize.query(`SELECT clm from solicitud_contratacion WHERE cod_solicitud_contratacion=${cod}`);
      var clm=parseFloat(data[0].clm)+parseFloat(process.env.ASIGN_FAMILIAR);
      clm=clm.toFixed(2);
      this.addFamiliarAssignment(cod,clm);
    }else{
      await sequelize.query(`UPDATE solicitud_contratacion
      SET ind_asign_familiar='N'
      WHERE cod_solicitud_contratacion=${cod}`);
    }
    const [user]=await sequelize.query(`SELECT nombres_apellidos from usuario WHERE cod_usuario=${codUsuario}`);
    const usuarioReg=user[0].usuario;
    const [data]=await sequelize.query(`SELECT * from solicitud_contratacion WHERE cod_solicitud_contratacion=${cod}`);
    await collaboratorService.createCollaboratorfromSolicitude(data[0],usuarioReg);
    const codCollaborator= await collaboratorService.findIdCollaborator(data[0].nro_documento);
    await contractService.createContractfromSolicitude(data[0],codCollaborator,usuarioReg);
    await resourcesService.createResourcefromSolicitude(data[0],codCollaborator)

    const query=`UPDATE solicitud_contratacion
                 SET estado='Aprobado',fecha_aprob=CURRENT_DATE
                 WHERE cod_solicitud_contratacion=${cod}`;
    await sequelize.query(query);

  }

  async reject(cod){
    const query=`UPDATE solicitud_contratacion
                 SET estado='Rechazado',fecha_rechaz=CURRENT_DATE
                 WHERE cod_solicitud_contratacion=${cod}`;
    await sequelize.query(query);
  }

  async addFamiliarAssignment(cod,clm){
    const query=`UPDATE solicitud_contratacion
                 SET ind_asign_familiar='S',clm='${clm}'
                 WHERE cod_solicitud_contratacion=${cod}`;
    await sequelize.query(query);
  }

  async approvegg(cod){
    const query=`UPDATE solicitud_contratacion
                 SET estado='Pendiente Aprobacion',fecha_aprob_gg=CURRENT_DATE
                 WHERE cod_solicitud_contratacion=${cod}`;
    await sequelize.query(query);
  }

}

module.exports = ContractSolicitudeService;
