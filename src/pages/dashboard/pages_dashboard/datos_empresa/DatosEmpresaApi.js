import { axiosCrud } from '@components/axios/axiosCrud';
import { consultarEmpresas } from '@/common/api/EmpresasApi';
import swal from '@components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const consultarEmpresa = async () => {
  const URL = '/auth/login/usuario';
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

export const actualizar = async (registro) => {
  const URL = '/empresa';
  try {
    console.log('registro: ');
    console.log(registro);
    const response = await axiosCrud.actualizar(URL, registro);
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

export const axiosDatosEmpre = {
  consultarEmpresa: async function () {
    return consultarEmpresa();
  },

  consultarRamo: async function () {
    return consultarRamo();
  },

  actualizar: async function (oEntidad) {
    return actualizar(oEntidad);
  },
  consultarEmpresas: async function () {
    return consultarEmpresas();
  },
};

export default axiosDatosEmpre;
