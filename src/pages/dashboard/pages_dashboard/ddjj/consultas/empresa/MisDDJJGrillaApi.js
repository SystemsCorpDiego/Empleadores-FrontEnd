import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@components/axios/axiosCrud';
import { consultarAportes } from '@/common/api/AportesApi';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const obtenerMisDeclaracionesJuradas = async (
  empresaId,
  desde,
  hasta,
) => {
  let queryString = '';

  if (desde !== null) {
    queryString += `&desde=${desde}`;
  }
  if (hasta !== null) {
    queryString += `&hasta=${hasta}`;
  }
  //const URL = `/ddjj/totales?${queryString}`;

  const URL = `/empresa/${empresaId}/ddjj/totales?${queryString}`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    console.log(
      'obtenerMisDeclaracionesJuradas() - catch-error - URL: ' +
        URL +
        ' - status: ' +
        error.status,
    );

    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const imprimirDeclaracionJurada = async (
  empresaId,
  ddjjId,
  periodo,
  secuencia,
) => {
  const URL = `/empresa/${empresaId}/ddjj/${ddjjId}/imprimir`;

  try {
    const response = await oAxios.get(URL, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    var strPeriodo = periodo;
    try {
      strPeriodo = periodo.split('-')[0] + periodo.split('-')[1];
    } catch {}
    var strSecuencia = secuencia;
    if (secuencia == null) {
      strSecuencia = 'SinPresentar';
    } else {
      if (secuencia == 0) {
        strSecuencia = 'Original';
      } else {
        strSecuencia = 'Rectif_' + secuencia;
      }
    }
    link.setAttribute(
      'download',
      `UOMA_ddjj_${strPeriodo}_${strSecuencia}.pdf`,
    );
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    swal.showErrorBackEnd('Error de Impresion', error);
  }
};

export const presentarDeclaracionJurada = async (empresaId, ddjjId) => {
  const URL = `/empresa/${empresaId}/ddjj/${ddjjId}/presentar`;
  try {
    const response = await oAxios.patch(URL);
    if (response.status === 200 || response.status === 204) {
      swal.showSuccess(HTTP_MSG_MODI);
      return response.data || {};
    }
    throw response;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
  }
  return false;
};

export const eliminarDeclaracionJurada = async (empresaId, ddjjId) => {
  const URL = `/empresa/${empresaId}/ddjj`;
  try {
    const response = await axiosCrud.eliminar(URL, ddjjId);
    if (response == true) {
      swal.showSuccess(HTTP_MSG_BAJA);
      return true;
    }
    throw response;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_BAJA_ERROR, error);
    return false;
  }
};

/*
export const obtenerMiDeclaracionJurada = async (empresaId, ddjjId) => {
  const URL = `/empresa/${empresaId}/ddjj/${ddjjId}`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || {};
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};
*/

export const axiosDDJJ = {
  getAportes: async function () {
    return consultarAportes();
  },

  consultar: async function (empresaId, desde, hasta) {
    return obtenerMisDeclaracionesJuradas(empresaId, desde, hasta);
  },

  //getDDJJ: async function (empresaId, ddjjId) {
  //return obtenerMiDeclaracionJurada(empresaId, ddjjId);
  //},

  imprimir: async function (empresaId, ddjjId, periodo, secuencia) {
    return imprimirDeclaracionJurada(empresaId, ddjjId, periodo, secuencia);
  },

  presentar: async function (empresaId, ddjjId) {
    return presentarDeclaracionJurada(empresaId, ddjjId);
  },

  eliminar: async function (empresaId, ddjjId) {
    return eliminarDeclaracionJurada(empresaId, ddjjId);
  },
};
