import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@/components/axios/axiosCrud';
import swal from '@/components/swal/swal';
import Swal from 'sweetalert2';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const VITE_HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;

const ordenaGrillaPeriodo = (response) => {
  console.log('response', response.declaracionesJuradas);
  if (response.declaracionesJuradas !== null || response.declaracionesJuradas.length !== 0) {
    const agrupado = response.declaracionesJuradas.reduce((acc, curr) => {
      const clave = `${curr.id}`;
      if (!acc[clave]) {
        acc[clave] = {
          id: curr.id,
          convenioDdjjId: curr.convenioDdjjId,
          periodo: curr.periodo,
          rectificativa: curr.rectificativa,
        };
      }
      acc[clave][curr.aporteDescripcion] = curr.importe;
      acc[clave].importeTotal = (acc[clave].importeTotal || 0) + curr.importeTotal;
      acc[clave].intereses = (acc[clave].intereses || 0) + curr.intereses;
      return acc;
    }, {});

    console.log('agrupado', agrupado);
    const resultado = Object.values(agrupado);

    response.declaracionesJuradas = resultado;
  } else {
    response.declaracionesJuradas = [];
  }
  if (response.actas === null || response.actas.length === 0) {
    response.actas = [];
  }
  if (response.saldosAFavor === null || response.saldosAFavor.length === 0) {
    response.saldosAFavor = [];
  }
  return response
}

export const getGestionDeuda = async (empresa_id, entidad) => {
  const URL = `/empresa/${empresa_id}/deuda/entidad/${entidad}`;
  const response = await axiosCrud.consultar(URL);
  console.log(response)
  if (
    response &&
    response.declaracionesJuradas &&
    response.actas &&
    response.saldosAFavor &&
    response.declaracionesJuradas.length === 0 &&
    response.actas.length === 0 &&
    response.saldosAFavor.length === 0
  ) {

    Swal.fire({
      icon: 'info',
      title: 'Sin Deuda',
      text: 'No se registra deuda al día de la fecha',
    });

  }
  return response
}

export const getGestionEditar = async (empresa_id, convenioId) => {
  const URL = `/empresa/${empresa_id}/convenios/${convenioId}/deudaDto`;

  const response = await axiosCrud.consultar(URL);
  return response
  //return emuRespuesta
}

export const getDeclaracionesJuradas = async (empresa_id, entidad) => {
  try {

    const response = await getGestionDeuda(empresa_id, entidad);
    const grilaOrdenada = ordenaGrillaPeriodo(response);
    return grilaOrdenada;

  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    throw error;
  }
};



export const getDetalleConvenio = async (empresa_id, body) => {
  try {
    const URL = `/empresa/${empresa_id}/convenios/calcular-cuota`;
    console.log('body', body);
    if (body.fechaIntencionPago !== null && body.fechaIntencionPago !== 'Invalid Date') {
      console.log('body', body);
      const response = await axiosCrud.crear(URL, body);
      return response;
    }
    return {
      "importeDeuda": 0,
      "cantidadCuota": 1,
      "fechaIntencionPago": "",
      "importeCuota": 0,
      "importeInteresTotal": 0
    };
    //const URL = `/empresa/${empresa_id}/gestion-deuda/${entidad}/detalle-convenio`;
    //const reponse = axiosCrud.crear(URL,body)
    //return response;

  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    throw error;
  }
};


export const generarConvenio = async (idEmpresa, bodyConvenio) => {
  try {
    const URL = `/empresa/${idEmpresa}/convenios`;
    const response = await axiosCrud.crear(URL, bodyConvenio);
    console.log('response', response);
    if (response && response.id) {
      console.log('Convenio generado:', response);
      return true;
    }
    else {
      return response; //Envia en el response el mensaje de error a generarConvenio de empresaHelper.js
    }

  } catch (error) {
    console.error('Error al generar el convenio:', error);
    throw error;
  }
};

const getDeclaracionesJuradasEditar = async (empresa_id, convenioId) => {
  try {

    //const empresa_id = localStorage.getItem('empresaId');
    const response = await getGestionEditar(empresa_id, convenioId);
    console.log('response', response);

    const grilaOrdenada = ordenaGrillaPeriodo(response);
    //const grilaOrdenada = ordenaGrillaPeriodo(emuRespuesta);
    console.log('grilaOrdenada', grilaOrdenada);
    return grilaOrdenada;

  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    throw error;
  }
}

const putActualizarConvenio = async (empresa_id, convenioId, body) => {
  try {
    const URL = `/empresa/${empresa_id}/convenios`;
    if (body.hasOwnProperty('entidad')) {
      delete body.entidad;
    }
    const response = await axiosCrud.actualizar(URL, body, convenioId);
    console.log('response', response);
    if (response === true) {
      return true;
    } else {
            await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.descripcion,
        confirmButtonText: 'Aceptar'
      });
      throw new Error(HTTP_MSG_MODI_ERROR);
    }
  } catch (error) {
    throw error;
  }
}



const getEmpresaByCuit = async (cuit,empresas) => {
  try {
    //console.log('getEmpresaByCuit - cuit:', cuit);
    //const URL = `/empresa`;

    let response = empresas
    if (response === null || response === undefined) {
      try {
        response = await axiosGestionDeudas.getEmpresas()
      } catch (error) {
        throw new Error('Error al obtener las empresas: ' + error.message);
      }
    }
    console.log('response', response);
    if (response && response.length > 0) {

      const empresaEncontrada = response.find(e => e.cuit == cuit);
      console.log('empresaEncontrada', empresaEncontrada);
      if (!empresaEncontrada) {
        throw new Error('No se encontró la empresa con el CUIT proporcionado.');
      }
      return empresaEncontrada.id? empresaEncontrada.id : null;
    } else {
      throw new Error('No se encontró la empresa con el CUIT proporcionado.');
    }
  } catch (error) {
    throw error;
  }
};

const getEmpresaByNombre = async (nombreEmpresa, empresas) => {
  try {
    //console.log('getEmpresaByCuit - cuit:', cuit);
    
    const response =empresas
    console.log('response', response);
    if (response && response.length > 0) {

      const empresaEncontrada = response.find(e => e.razonSocial == nombreEmpresa);
      console.log('empresaEncontrada', empresaEncontrada);
      if (!empresaEncontrada) {
        throw new Error('No se encontró la empresa con el CUIT proporcionado.');
      }
      return empresaEncontrada.id? empresaEncontrada.id : null;
    } else {
      throw new Error('No se encontró la empresa con el CUIT proporcionado.');
    }
  } catch (error) {
    throw error;
  }
};

const getEmpresas = async () => {
  try {
    const URL = `/empresa`;
    const response = await axiosCrud.consultar(URL);
    console.log('response', response);
    if (response && response.length > 0) {
      return response;
    } else {
      throw new Error('No se encontraron empresas.');
    }
  } catch (error) {
    throw error;
  }
};

export const axiosGestionDeudas = {
  getDeclaracionesJuradas,
  getDetalleConvenio,
  getDeclaracionesJuradasEditar,
  putActualizarConvenio,
  getEmpresaByCuit,
  getEmpresaByNombre,
  getEmpresas,
  generarConvenio
};
