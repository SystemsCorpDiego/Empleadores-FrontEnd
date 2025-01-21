import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const consultarAportes = async () => {
  const URL = '/aportes/';
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

export const consultarAportesDDJJ = async () => {
  const URL = '/aportes/ddjj';

  try {
    const data = await axiosCrud.consultar(URL);
    console.log('consultarAportesDDJJ - data: ', data);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const axiosAportes = {
  consultar: async function () {
    return consultarAportes();
  },
  consultarAportesDDJJ: async function () {
    return consultarAportesDDJJ();
  },
};
