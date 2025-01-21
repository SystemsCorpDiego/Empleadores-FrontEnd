import oAxios from '@components/axios/axiosInstace';
import { errorBackendResponse } from '../../../../errors/errorBackendResponse';

export const ObtenerDatosDeContacto = async () => {
  /*
  const contacto = {
    email: "mesadeayuda@ospim.com.ar",
    telefono: "011-4502-2075",
    whasap: "15-4569-4545",
  };
  return contacto;
  */
  const URL = `/ospim/contacto`;
  //console.log('ObtenerDatosDeContacto - URL: ');
  //console.log(URL);

  try {
    const response = await oAxios.get(URL);
    const data = await response.data;
    return data || [];
  } catch (error) {
    console.log('ObtenerDatosDeContacto - ERROR 11 ');
    console.log('ObtenerDatosDeContacto - ERROR - error: ');
    console.log(error);
    errorBackendResponse(error);
  }
};

export const ObtenerPublicacionesVigentes = async () => {
  const URL = `/publicaciones/vigentes`;

  try {
    const response = await oAxios.get(URL);
    const data = await response.data;
    return data || [];
  } catch (error) {
    console.log('ObtenerPublicacionesVigentes - ERROR');
    errorBackendResponse(error);
  }
};
