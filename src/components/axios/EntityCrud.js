import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const axiosEntity = {
  consultar: async function (UrlApi) {
    return consultar(UrlApi);
  },

  crear: async function (UrlApi, oEntidad) {
    return crear(UrlApi, oEntidad);
  },

  actualizar: async function (UrlApi, oEntidad) {
    return actualizar(UrlApi, oEntidad);
  },

  eliminar: async function (UrlApi, id) {
    return eliminar(UrlApi, id);
  },
};

export const consultar = async (UrlApi) => {
  try {
    const data = await axiosCrud.consultar(UrlApi);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${UrlApi} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const crear = async (UrlApi, registro) => {
  try {
    const data = await axiosCrud.crear(UrlApi, registro);
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

export const actualizar = async (UrlApi, registro) => {
  try {
    const response = await axiosCrud.actualizar(UrlApi, registro);
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

export const eliminar = async (UrlApi, id) => {
  try {
    const response = await axiosCrud.eliminar(UrlApi, id);
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

export const patch = async (UrlApi, oEntidad) => {
  try {
    const response = await axiosCrud.patch(UrlApi, oEntidad);
    if (response == true) {
      swal.showSuccess(HTTP_MSG_MODI);
      return true;
    }
    throw response;
  } catch (error) {
    console.log('patch - error: ', error);
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};
