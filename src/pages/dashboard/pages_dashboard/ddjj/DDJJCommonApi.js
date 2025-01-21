import oAxios from '@components/axios/axiosInstace';
import swal from '@/components/swal/swal';

const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;

export const presentar = async (empresaId, ddjjId) => {
  const URL = `/empresa/${empresaId}/ddjj/${ddjjId}/presentar`;
  try {
    const response = await oAxios.patch(URL);
    if (response.status === 200 || response.status === 204) {
      swal.showSuccess(HTTP_MSG_MODI);
      return response.data || null;
    }
    throw response;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
  }
  return null;
};
