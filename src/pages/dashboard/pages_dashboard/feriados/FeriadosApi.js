import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const VITE_HTTP_MSG_PROCESO_ERROR = import.meta.env.VITE_HTTP_MSG_PROCESO_ERROR;
const VITE_HTTP_MSG_PROCESO = import.meta.env.VITE_HTTP_MSG_PROCESO;
const URL_ENTITY = '/feriados';

export const axiosFeriados = {
  consultar: async function (anio) {
    return consultar(anio);
  },

  crear: async function (oEntidad) {
    return crear(oEntidad);
  },

  actualizar: async function (oEntidad) {
    return actualizar(oEntidad);
  },

  eliminar: async function (id) {
    return eliminar(id);
  },

  duplicar: async function (anio) {
    return duplicarFeriados(anio);
  },
};

export const consultar = async (anio) => {
  try {
    let URL_FLT = '';
    if (anio && anio.year()) {
      URL_FLT = '/' + anio.year();
    } else {
      console.log('NO EXISTE anio.year() ');
    }
    const data = await axiosCrud.consultar(URL_ENTITY + URL_FLT);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const crear = async (registro) => {
  try {
    const data = await axiosCrud.crear(URL_ENTITY, registro);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    }
    throw data;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return {};
  }
};

export const actualizar = async (registro) => {
  try {
    const response = await axiosCrud.actualizar(URL_ENTITY, registro);
    if (response == true) {
      swal.showSuccess(HTTP_MSG_MODI);
      return true;
    }
    throw response;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};

export const eliminar = async (id) => {
  try {
    const response = await axiosCrud.eliminar(URL_ENTITY, id);
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

export const duplicarFeriados = async (anio) => {
  const URL = `${URL_ENTITY}/duplicar/${anio}`;

  try {
    const oAxios = axiosCrud.getOAxios();
    const response = await oAxios.post(URL);
    if (response && response.status && response.status == 201) {
      swal.showSuccess(VITE_HTTP_MSG_PROCESO);
      return true;
    }
    swal.showError(VITE_HTTP_MSG_PROCESO_ERROR);
    return false;
  } catch (error) {
    swal.showErrorBackEnd(
      VITE_HTTP_MSG_PROCESO_ERROR +
        ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return false;
  }
};
