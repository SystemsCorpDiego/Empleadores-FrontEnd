import formatter from '@/common/formatter';
import { axiosCrud } from '@/components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;

const calcularInteres = async (url, intencionDePago) => {
  const body = { intencionDePago: intencionDePago };
  console.log(body);
  const response = await axiosCrud.crear(url, body);
  return response;
};

export const getBoletasByDDJJid = async (empresa_id, ddjj_id) => {
  const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas/armar`;
  try {
    console.log(empresa_id);
    console.log(ddjj_id);
    const data = await axiosCrud.consultar(URL);
    return data;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

export const calcularInteresBoleta = async (
  empresa_id,
  ddjj_id,
  boleta_codigo,
  intencionDePago,
) => {
  const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas/${boleta_codigo}/armar`;
  console.log(URL);
  try {
    //const response = await calcularInteres(URL, intencionDePago);
    const body = { intencionDePago: intencionDePago };
    console.log(body);
    const data = await axiosCrud.crear(URL, body);
    console.log('calcularInteresBoleta - response: ', data);

    if (!data.detalle_boletas) {
      throw data;
    }

    console.log(data.detalle_boletas);
    return data.detalle_boletas[0];
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
    return {};
  }
};

export const calcularInteresBoletas = async (
  empresa_id,
  ddjj_id,
  intencionDePago,
) => {
  //const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/calcular-intereses`;
  const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas/armar`;
  try {
    //const data = await calcularInteres(URL, intencionDePago);
    const body = { intencionDePago: intencionDePago };
    const data = await axiosCrud.crear(URL, body);

    console.log('calcularInteresBoletas - calcularInteres() - data:', data);
    if (!data.detalle_boletas) {
      throw data;
    }
    return data;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
    return {};
  }
};

const ordernarBoletas = (boletas) => {
  const newArray = boletas.detalle_boletas.map((detalle) => ({
    codigo: detalle.codigo,
    intencionDePago: formatter.toFechaValida(detalle.intencionDePago),
    formaDePago: detalle.formaDePago,
  }));

  return newArray;
};

export const generarBoletasPost = async (empresa_id, ddjj_id, boletas) => {
  try {
    const URL = `/empresa/${empresa_id}/ddjj/${ddjj_id}/boletas/generar`;
    const arr_boletas = ordernarBoletas(boletas);
    console.log('generarBoletasPost - arr_boletas: ', arr_boletas);

    const data = await axiosCrud.crearN(URL, arr_boletas);
    console.log('generarBoletasPost - data: ', data);
    if (data == true) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    }
    throw data;
  } catch (error) {
    console.log('generarBoletasPost - catch ...');
    swal.showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return false;
  }
};

export const axiosGenerarBoletas = {
  getBoletasByDDJJid,
  calcularInteresBoleta,
  calcularInteresBoletas,
  generarBoletasPost,
};
