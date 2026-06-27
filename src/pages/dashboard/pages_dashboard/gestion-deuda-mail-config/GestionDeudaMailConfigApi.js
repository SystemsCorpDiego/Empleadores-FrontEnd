import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const URL_ENTITY = '/gestionDeuda/mail/config';

export const consultar = async () => {
  try {
    const data = await axiosCrud.consultar(URL_ENTITY);
    return data || null;
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return null;
  }
};

export const crear = async (nuevoReg) => {
  try {
    const data = await axiosCrud.crear(URL_ENTITY, nuevoReg);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    }
    throw data;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return null;
  }
};

export const actualizar = async (reg) => {
  try {
    const response = await axiosCrud.actualizar(URL_ENTITY, reg);
    if (response === true) {
      swal.showSuccess(HTTP_MSG_MODI);
      return true;
    }
    throw response;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};
