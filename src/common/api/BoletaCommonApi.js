import oAxios from '@components/axios/axiosInstace';
import swal from '@/components/swal/swal';

const MSG_IMPRESION_ERROR = import.meta.env.VITE_HTTP_MSG_IMPRESION_ERROR;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const boletaPdfDownload = async (empresa_id, id) => {
  const URL = `/empresa/${empresa_id}/boletas/${id}/imprimir`;

  try {
    const response = await oAxios({
      url: URL,
      method: 'GET',
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'boleta.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error al descargar el archivo PDF:', error);
    swal.showErrorBackEnd(MSG_IMPRESION_ERROR, error);
  }
};

export const detallePdfDownload = async (empresa_id, id) => {
  const URL = `${BACKEND_URL}/empresa/${empresa_id}/boletas/${id}/imprimir-detalle`;

  try {
    const response = await oAxios({
      url: URL,
      method: 'GET',
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'boletaDetalle.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error al descargar el archivo PDF:', error);
  }
};
