import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@/components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;

export const getBoletasByDDJJid = async (empresa_id, ddjj_id) => {
  try {
    const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas/armado`;
    const response = axiosCrud.consultar(URL);
    console.log(response);
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

export const getBoletasEmpresa = async (empresa_id, desde, hasta) => {
  try {
    let queryString = '';

    if (desde !== null) {
      queryString += `&desde=${desde}`;
    }
    if (hasta !== null) {
      queryString += `&hasta=${hasta}`;
    }

    const URL = `/empresa/${empresa_id}/boletas/consulta-gral?${queryString}`;
    const response = axiosCrud.consultar(URL);
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

export const getBoletasEmpleado = async (filtro) => {
  try {
    let queryString = '';

    if (filtro.periodoDesde !== null) {
      queryString += `&periodoDesde=${filtro.periodoDesde}`;
    }
    if (filtro.periodoHasta !== null) {
      queryString += `&periodoHasta=${filtro.periodoHasta}`;
    }
    if (filtro.cuit !== null) {
      queryString += `&cuit=${filtro.cuit}`;
    }
    if (filtro.concepto !== null) {
      queryString += `&concepto=${filtro.concepto}`;
    }
    if (filtro.entidad !== null) {
      queryString += `&entidad=${filtro.entidad}`;
    }
    if (filtro.formaPago !== null) {
      queryString += `&formaPago=${filtro.formaPago}`;
    }

    const URL = `/boletas/consulta-gral?${queryString}`;
    const response = axiosCrud.consultar(URL);
    return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

export const getBoletaById = async (empresa_id, boleta_id) => {
  const URL = `/empresa/${empresa_id}/boletas/${boleta_id}`;
  try {
    const response = axiosCrud.consultar(URL);
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const validarModificacion = async (empresa_id, boleta_id) => {
  console.log(
    `validarModificacion - empresa_id: ${empresa_id} - boleta_id: ${boleta_id}`,
  );
  try {
    const URL = `/empresa/${empresa_id}/boletas/${boleta_id}/validar-modi`;
    const rta = await axiosCrud.consultar(URL);
    console.log('validarModificacion - rta: ', rta);
    if (rta && rta.hasOwnProperty('reemplazar')) {
      return rta;
    }
    throw rta;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_CONSUL_ERROR, error);
    return null;
  }
};

export const modificarBoletaById = async (empresa_id, body) => {
  console.log('modificarBoletaById - body:', body);
  const URL = `/empresa/${empresa_id}/boletas`;
  try {
    //const bodyNew = [...body.intencionDePago, body.id, body.formaDePago];
    const bodyNew = {
      id: body.id,
      intencionDePago: body.intencionDePago,
      formaDePago: body.formaDePago,
    };

    //bodyNew.intencionDePago = formatter.toFechaValida(bodyNew.intencionDePago);
    console.log('bodyNew: ', bodyNew);

    const rta = await axiosCrud.actualizar(URL, bodyNew);
    console.log('modificarBoletaById - axiosCrud.actualizar() - rta: ', rta);
    if (rta && rta == true) {
      //swal.showSuccess(HTTP_MSG_MODI);
      return true;
    }
    throw rta;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};

export const generarBep = async (empresa_id, boletaId) => {
  try {
    const URL = `/empresa/${empresa_id}/boletas/${boletaId}/generar-bep`;
    const response = await oAxios.post(URL);
    //console.log('response:', response);
    if (response.status == 200) {
      if (response.data.bep && response.data.bep != null) {
        swal.showSuccess('El BEP fue generado con exito');
      } else {
        //Mensaje ERROR Generico
        swal.showError(
          'El BEP no pudo ser generado. Por favor intente mas tarde.',
        );
      }
      return response.data;
    } else {
      swal.showError(
        'El BEP no pudo ser generado. Por favor intente mas tarde.',
      );
      return null;
    }
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
    return null;
  }
};

export const axiosBoletas = {
  getBoletasByDDJJid,
  getBoletasEmpresa,
  getBoletasEmpleado,
  getBoletaById,
  modificarBoletaById,
  generarBep,
  validarModificacion: async function (empresa_id, boleta_id) {
    return await validarModificacion(empresa_id, boleta_id);
  },
};
