//URL: /usuario/interno/persona/logueada
import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;

const URL_ENTITY = '/usuario/interno/persona/logueada';

export const axiosPersonaLogueda = {
  actualizar: async function (oEntidad) {
    return actualizar(oEntidad);
  },
};

export const actualizar = async (registro) => {
  /*
        {  nombre:, apellido:, email:, }
  */

  try {
    console.log(registro);
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
