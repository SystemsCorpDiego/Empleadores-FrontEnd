import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@/components/axios/axiosCrud';
import swal from '@/components/swal/swal';
import Swal from 'sweetalert2';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const VITE_HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const emuRespuesta = {
  "id": 20,
  "entidad": "UOMA",
  "empresaId": "836",
  "cuit": "30537582916",
  "razonSocial": "PUEBA 30537582916",
  "deuda": 994435.14,
  "interes": 7359340.84,
  "saldoFavor": 100000,
  "intencionPago": "2025-06-20",
  "cuotas": 3,
  "medioPago": "CHEQUE",
  "convenioNro": null,
  "actas": [],
  "declaracionesJuradas": [
    {
      "convenioDdjjId": 57,
      "id": 7872028,
      "periodo": "2025-01-01",
      "rectificativa": 0,
      "aporteCodigo": "ART46",
      "aporteDescripcion": "Art. 46",
      "importe": 14056.78,
      "intereses": 4566.08,
      "importeTotal": 18622.86
    },
    {
      "convenioDdjjId": 57,
      "id": 7872028,
      "periodo": "2025-01-01",
      "rectificativa": 0,
      "aporteCodigo": "UOMAAS",
      "aporteDescripcion": "Aporte Solidario UOMA",
      "importe": 353000,
      "intereses": 110121.96,
      "importeTotal": 463121.96
    },
    {
      "convenioDdjjId": 57,
      "id": 7872028,
      "periodo": "2025-01-01",
      "rectificativa": 0,
      "aporteCodigo": "UOMACS",
      "aporteDescripcion": "Cuota Social UOMA",
      "importe": 353000,
      "intereses": 114647.52,
      "importeTotal": 467647.52
    },
    {
      "convenioDdjjId": 57,
      "id": 7872028,
      "periodo": "2025-01-01",
      "rectificativa": 0,
      "aporteCodigo": "UOMACU",
      "aporteDescripcion": "Cuota Usufructo",
      "importe": 34000,
      "intereses": 11042.8,
      "importeTotal": 45042.8
    },
    {
      "convenioDdjjId": null,
      "id": 7872027,
      "periodo": "2025-01-01",
      "rectificativa": 0,
      "aporteCodigo": "ART46",
      "aporteDescripcion": "Art. 46",
      "importe": 14056.78,
      "intereses": 4566.08,
      "importeTotal": 18622.86
    },
    {
      "convenioDdjjId": null,
      "id": 7872027,
      "periodo": "2025-01-01",
      "rectificativa": 0,
      "aporteCodigo": "UOMAAS",
      "aporteDescripcion": "Aporte Solidario UOMA",
      "importe": 353000,
      "intereses": 110121.96,
      "importeTotal": 463121.96
    },
    {
      "convenioDdjjId": null,
      "id": 7872027,
      "periodo": "2025-01-01",
      "rectificativa": 0,
      "aporteCodigo": "UOMACS",
      "aporteDescripcion": "Cuota Social UOMA",
      "importe": 353000,
      "intereses": 114647.52,
      "importeTotal": 467647.52
    },
    {
      "convenioDdjjId": null,
      "id": 7872027,
      "periodo": "2025-01-01",
      "rectificativa": 0,
      "aporteCodigo": "UOMACU",
      "aporteDescripcion": "Cuota Usufructo",
      "importe": 34000,
      "intereses": 11042.8,
      "importeTotal": 45042.8
    }
  ],
  "saldosAFavor": [
    {
      "convenioAjusteId": 70,
      "id": 9243,
      "motivo": "O",
      "importe": -100000,
      "vigencia": "2025-01-01"
    }
  ]
}

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
    if (response && Object.keys(response).length > 0) {
      return true;
    }
    else {
      swal.showErrorBackEnd(VITE_HTTP_MSG_ALTA_ERROR, response);
    }

    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
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
    swal.showErrorBackEnd(HTTP_MSG, error);
    //sacar cuando este el back

    //sacar cuando este el back
  }
}

const putActualizarConvenio = async (empresa_id, convenioId, body) => {
  try {
    const URL = `/empresa/${empresa_id}/convenios`;
    if (body.hasOwnProperty('entidad')) {
      delete body.entidad;
    }
    const response = await axiosCrud.actualizar(URL, body, convenioId);
    //const reponse = await oAxios.put(URL, body);
    console.log('response', response);

    if (response === false) {
      swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, response);
      return response;
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Convenio actualizado!',
        text: 'Serás redirigido al resumen',
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/dashboard/convenios');
        }
      });
      return response;
    }

  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_MODI_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
}

export const axiosGestionDeudas = {
  getDeclaracionesJuradas,
  getDetalleConvenio,
  getDeclaracionesJuradasEditar,
  putActualizarConvenio
};
