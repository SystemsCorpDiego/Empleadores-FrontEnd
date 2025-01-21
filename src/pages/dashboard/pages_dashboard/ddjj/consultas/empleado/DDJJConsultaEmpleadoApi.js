import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const obtenerDDJJ = async () => {
  const URL = `/ddjj/totales`;
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

export const consultaDDJJfiltrada = async (desde, hasta, cuit) => {
  let queryString = '';

  if (desde !== null) {
    queryString += `&desde=${desde}`;
  }
  if (hasta !== null) {
    queryString += `&hasta=${hasta}`;
  }
  if (cuit != null) {
    queryString += `&cuit=${cuit}`;
  }

  const URL = `/ddjj/totales?${queryString}`;

  try {
    const data = await axiosCrud.consultar(URL);
    //const data = await oAxios.get(URL, jsonBody);
    //const data = await oAxios({ URL, jsonBody });
    return data || [];
  } catch (error) {
    console.log(
      'obtenerPorRangoCuit() - catch-error - URL: ' +
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

export const axiosDDJJEmpleado = {
  consultar: async function () {
    return obtenerDDJJ();
  },
  consultarFiltrado: async function (desde, hasta, cuit) {
    return consultaDDJJfiltrada(desde, hasta, cuit);
  },
};
