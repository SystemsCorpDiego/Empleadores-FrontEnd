import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const activar = async (token) => {
  const sUrl = `auth/usuario/activar/${token}/`;
  console.log('axiosUsuaEmpreActivacion - sUrl: ', sUrl);

  const response = await axiosCrud.crear(sUrl, null);
  console.log('*** axiosUsuaEmpreActivacion - response: ', response);

  return response;
};

export const axiosUsuaEmpreActivacion = {
  activar: (token) => {
    return activar(token);
  },
};
