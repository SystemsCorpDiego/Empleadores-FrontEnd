import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const obtenerTipo = async () => {
  const URL = '/empresa/contacto/tipo';
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const obtenerDatosEmpresa = async (id) => {
  const URL = `/empresa/${id}/contacto`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const crearContacto = async (idEmpresa, contacto) => {
  const URL = `/empresa/${idEmpresa}/contacto`;
  try {
    const data = await axiosCrud.crear(URL, contacto);
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

export const actualizarContacto = async (idEmpresa, contacto) => {
  const URL = `/empresa/${idEmpresa}/contacto`;
  try {
    const response = await axiosCrud.actualizar(URL, contacto);
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

export const eliminarContacto = async (idEmpresa, idContacto) => {
  const URL = `/empresa/${idEmpresa}/contacto`;
  try {
    const response = await axiosCrud.eliminar(URL, idContacto);
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

export const axiosContacto = {
  obtenerTipo: async function () {
    return obtenerTipo();
  },

  obtenerDatosEmpresa: async function (idEmpresa) {
    return obtenerDatosEmpresa(idEmpresa);
  },

  crear: async function (idEmpresa, contacto) {
    return crearContacto(idEmpresa, contacto);
  },

  actualizar: async function (idEmpresa, contacto) {
    return actualizarContacto(idEmpresa, contacto);
  },

  eliminar: async function (idEmpresa, idContacto) {
    return eliminarContacto(idEmpresa, idContacto);
  },
};
