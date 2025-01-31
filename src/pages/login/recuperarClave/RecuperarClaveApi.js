import swal from '@/components/swal/swal';
import { axiosCrud } from '@components/axios/axiosCrud';

//const RECUPERO_MSG = import.meta.env.VITE_RECUPERO_MSG;
const RECUPERO_ERROR = import.meta.env.VITE_RECUPERO_ERROR;

export const recuperarClave = async (email) => {
  try {
    const URL = `/auth/usuario/recupera-clave/token`;
    let mailDto = { mail: email };
    console.log('recuperoClave - mailDto:', mailDto);

    const response = await axiosCrud.crear(URL, mailDto);
    if (response && response.token) {
      //swal.showSuccess(RECUPERO_MSG);
      return true;
    }
    swal.showErrorBackEnd(RECUPERO_ERROR, response);
    console.log('recuperoClave - response:', response);
    return false;
  } catch (error) {
    console.log('recuperoClave - error:', error);
    const HTTP_MSG = RECUPERO_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
    return false;
  }
};
