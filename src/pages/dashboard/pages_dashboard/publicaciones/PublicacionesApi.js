import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const URL_ENTITY = '/publicaciones';

export const axiosPublicaciones = {
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

export const consultar = async () => {
  try {
    const data = await axiosCrud.consultar(URL_ENTITY);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const crear = async (nuevoReg) => {
  try {
    const data = await axiosCrud.crear(URL_ENTITY, nuevoReg);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    } else {
      swal.showErrorBackEnd(HTTP_MSG_ALTA_ERROR, data);
      return {};
    }
  } catch (error) {
    console.log(
      `crearCuitRestringido() - ERROR 1 - nuevoReg: ${JSON.stringify(
        nuevoReg,
      )} - error: ${JSON.stringify(error)}`,
    );
    console.log('crearCuitRestringido - ERROR - return {}   ');
    return {};
  }
};

export const actualizar = async (reg) => {
  try {
    const response = await axiosCrud.actualizar(URL_ENTITY, reg);
    if (response == true) {
      swal.showSuccess(HTTP_MSG_MODI);
      return true;
    } else {
      swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(
      `actualizarCuitRestringido() - ERROR 1 - error: ${JSON.stringify(error)}`,
    );
    return false;
  }
};

export const eliminar = async (id) => {
  try {
    const response = await axiosCrud.eliminar(URL_ENTITY, id);

    if (response == true) {
      swal.showSuccess(HTTP_MSG_BAJA);
      return true;
    } else {
      swal.showErrorBackEnd(HTTP_MSG_BAJA_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(
      `eliminarCuitRestringido() - ERROR 1 - error: ${JSON.stringify(error)}`,
    );
    return false;
  }
};

export const cargarImagen = async (formData, id) => {
  try {
    const URL_IMG = `/${id}/archivo`;

    const response = await axiosCrud.crearFormData(
      `${URL_ENTITY}${URL_IMG}`,
      formData,
    );

    if ((response.status = 200)) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return true;
    } else {
      swal.showErrorBackEnd(HTTP_MSG_ALTA_ERROR, response);
      return false;
    }
  } catch (error) {
    console.log(`cargarImagen() - ERROR 1 - error: ${JSON.stringify(error)}`);
    return false;
  }
};

export const tieneImagenCargada = async (ID) => {
  if (ID) {
    try {
      const response = await fetch(`${BACKEND_URL}${URL_ENTITY}/${ID}/archivo`);
      return response.status === 200;
    } catch (error) {
      console.error("Error al verificar si la imagen está cargada:", error);
      return false;
    }
  }
  return false;
};
