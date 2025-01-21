import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const URL_ENTITY = '/publicaciones';

export const getImages = async (ids) => {
  const images = [];
  const urls = [];

  ids.forEach(async (ID) => urls.push(fetch(`${BACKEND_URL}${URL_ENTITY}/${ID}/archivo`)))
  try{
    for await (const response of urls) {
      const res = await response;
      console.log(response)
      if (res.status ===200){
        let blob = await response.blob();
        blob = new Blob([blob], { type: 'image/jpeg' });
        images.push(blob);
      }
    }
  } catch (error){
    console.error(error)
    swal.showError(HTTP_MSG_CONSUL_ERROR)
  }
  return images;
};
