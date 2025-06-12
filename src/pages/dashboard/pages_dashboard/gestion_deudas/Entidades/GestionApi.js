import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@/components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const VITE_HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const emuRespuesta = {
  declaracionesJuradas: [
    {
      id: 1233,
      periodo: '2024-04-01',
      rectificativa: 10,
      aporteCodigo: 'Cuota Social',
      aporteDescripcion: '',
      importe: 20.0,
      interes: 176.8,
      importeTotal: 196.8,
    },
    {
      id: 9312,
      periodo: '2024-04-01',
      rectificativa: 10,
      aporteCodigo: 'UOMACS',
      aporteDescripcion: 'Cuota Social UOMA',
      importe: 20.0,
      interes: 176.8,
      importeTotal: 196.8,
    },
  ],
  actas: [
    {
      id: 95,
      estadoDeuda: 'JUDICIALIZADO',
      nroActa: '123',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 100,
      estadoDeuda: 'PENDIENTE',
      nroActa: '124',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 101,
      estadoDeuda: 'PENDIENTE',
      nroActa: '125',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 102,
      estadoDeuda: 'PENDIENTE',
      nroActa: '126',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 103,
      estadoDeuda: 'PENDIENTE',
      nroActa: '127',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 104,
      estadoDeuda: 'PENDIENTE',
      nroActa: '128',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 105,
      estadoDeuda: 'PENDIENTE',
      nroActa: '129',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
  ],
  convenios: [
    {
      id: 1,
      estado: 'PENDIENTE',
      nroConvenio: 1,
      nroCuota: 2,
      totalCuota: 234,
      intereses: 42,
      totalActualizado: 276,
    },
    {
      id: 2,
      estado: 'PENDIENTE',
      nroConvenio: 1,
      nroCuota: 3,
      totalCuota: 234,
      intereses: 42,
      totalActualizado: 276,
    },
  ],
  saldosAFavor: [
    {
      id: 31,
      fecha: '2024-04-01',
      concepto: 'prueba',
      importe: 2000,
    },
    {
      id: 32,
      fecha: '2024-05-01',
      concepto: 'prueba',
      importe: 6000,
    },
  ],
};




const emuRespuestaDetalleConvenio = {

  importeInteres: 23020,
  importeCuota: 21312,


  /*
  detalleCuota: [
    {
      numero: 1,
      valor: 11010,
      vencimiento: '21/07/2024',
    },
    {
      numero: 2,
      valor: 11010,
      vencimiento: '21/08/2024',
    },
    {
      numero: 3,
      valor: 11010,
      vencimiento: '21/08/2024',
    },
  ],
  */
};

const bodyConvenio = {
  actas: [1, 2, 3], //acta_id
  periodos: [], //fecha o id boleta o id DDJJ
  cantCuotas: 1,
  fechaIntencionDePago: '2024-01-31',
  usarSaldoAFavor: true,
};

const ordenaGrillaPeriodo = (response) => {
  console.log('response', response.declaracionesJuradas);
  if (response.declaracionesJuradas !== null || response.declaracionesJuradas.length !== 0) {
    const agrupado = response.declaracionesJuradas.reduce((acc, curr) => {
      const clave = `${curr.id}`;
      if (!acc[clave]) {
        acc[clave] = {
          id: curr.id,
          periodo: curr.periodo,
          rectificativa: curr.rectificativa,
          //intereses: curr.intereses,
          //importeTotal: curr.importeTotal,
        };
      }
      acc[clave][curr.aporteDescripcion] = curr.importe;
      acc[clave].importeTotal = (acc[clave].importeTotal || 0) + curr.importe;
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
  return response
}

export const getGestionEditar = async (empresa_id, convenioId) => {
  const URL = `/empresa/${empresa_id}/convenios/${convenioId}/deudaDto`;
  
  const response = await axiosCrud.consultar(URL);
  return response
}

export const getDeclaracionesJuradas = async (empresa_id, entidad) => {
  try {

    const response = await getGestionDeuda(empresa_id, entidad);
    const grilaOrdenada = ordenaGrillaPeriodo(response);
    return grilaOrdenada;

  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
    //sacar cuando este el back

    //sacar cuando este el back
  }
};

export const getBoletasUsuarioInterno = async (entidad) => {
  const URL = `/empresa/boletas/gestion-deuda/${entidad}`;
  //const response = axiosCrud.consultar(URL);
  //return response;
  switch (entidad) {
    case 'AMTIMA':
      return emuRespuesta;
    case 'OSPIM':
      return emuRespuesta;
    case 'UOMA':
      return emuRespuesta;
    default:
      console.log('Entidad invalida');
  }

  return emuRespuesta;
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
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};


export const generarConvenio = async (idEmpresa, bodyConvenio) => {
  try {
    const URL = `/empresa/${idEmpresa}/convenios`;
    const response = await axiosCrud.crear(URL, bodyConvenio);



    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

const getDeclaracionesJuradasEditar = async (empresa_id, convenioId) => {
  try {
    console.log('estoy en declaracionesJuradasEditar');
    console.log('covenioId', convenioId);
    console.log('getDeclaracionesJuradasEditar');
    console.log('empresa_id', empresa_id);
    //const empresa_id = localStorage.getItem('empresaId');
    const response = await getGestionEditar(empresa_id, convenioId);
    console.log('response', response);
    const grilaOrdenada = ordenaGrillaPeriodo(response);
    return grilaOrdenada;

  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
    //sacar cuando este el back

    //sacar cuando este el back
  }
}

export const axiosGestionDeudas = {
  getDeclaracionesJuradas,
  getDetalleConvenio,
  getDeclaracionesJuradasEditar
};
