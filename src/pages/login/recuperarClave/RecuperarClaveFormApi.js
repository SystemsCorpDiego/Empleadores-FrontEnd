import { axiosCrud } from '@components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const tokenConsul = async (token) => {
  const sUrl = `/auth/usuario/recupera-clave/token/${token}`;
  const response = await axiosCrud.consultar(sUrl);
  console.log('tokenConsul - sUrl: ', sUrl);
  console.log('tokenConsul - response: ', response);
  return response;
};

const actualizarClave = async (tokenVig, claveNue) => {
  try {
    const sUrl = 'auth/usuario/recupera-clave/token/registrar-clave/';
    const dto = { token: tokenVig, clave: claveNue };

    console.log('actualizarClave - dto: ', dto);

    const response = await axiosCrud.crear(sUrl, dto);
    console.log('actualizarClave - response: ', response);
    if (response && response == true) {
      swal.showSuccess('La clave fue actualizada con exito');
      return response;
    }
    throw response;
  } catch (error) {
    swal.showErrorBackEnd('Error actualizando Clave', error);
    return false;
  }
};

export const RecuperarClaveFormApi = {
  cambiarClave: async (tokenVig, claveNue) => {
    return await actualizarClave(tokenVig, claveNue);
  },
  consultar: async (token) => {
    return await tokenConsul(token);
  },
};
