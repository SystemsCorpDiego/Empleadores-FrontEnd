import swal from '@/components/swal/swal';
import { axiosCrud } from '@components/axios/axiosCrud';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
export const getFuncionalidadesByRol = async (rol) => {
  try {
    const URL = `/funcionalidades/${rol}`;
    const response = await axiosCrud.consultar(URL);
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    
  }
};
