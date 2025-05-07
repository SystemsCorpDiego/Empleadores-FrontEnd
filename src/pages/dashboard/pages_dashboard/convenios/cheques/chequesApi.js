import { axiosCrud } from '@/components/axios/axiosCrud';
import formatter from '@/common/formatter';
import swal from '@/components/swal/swal';

const URL_ENTITY = '/cheques';
const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

let arregloCheques = [
    { convenioId: 1, id: 1, numero: '123', monto: 5000.0, cuota: 2 },
    { convenioId: 1, id: 2, numero: '123', monto: 5000.0, cuota: 2 },
    { convenioId: 1, id: 3, numero: '123', monto: 5000.0, cuota: 2 },
  ];

export const axiosCheques = {
  consultar: async function (UrlApi) {
    return consultar(UrlApi);
  },

  crear: async function (oEntidad) {
    return crear(oEntidad);
  },

  actualizar: async function (oEntidad) {
    return actualizar(oEntidad);
  },

  eliminar: async function (id) {
    return eliminar(id);
  },
};
export const consultar = async (convenio, cuota) => {
  try {
    const URL_API = `${URL_ENTITY}/${convenio}/${cuota}`;
    console.log(URL_API)
    //const data = await axiosCrud.consultar(URL_API);
    console.log(arregloCheques)
    return arregloCheques || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL_API} - status: ${error.status})`,
      error,
    );
    return [];
  }
};
export const crear = async (registro) => {
  try {
    //const data = await axiosCrud.crear(URL_ENTITY, registro);
    console.log(registro)
    const data = { convenioId: 1, id: Math.random(100) * 1.2 , numero: registro.numero, monto: 15000.0, cuota: 4 }
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    }
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_ALTA_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
  }
};
export const actualizar = async (registro) => {
  try {
    const data = await axiosCrud.actualizar(URL_ENTITY, registro);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_MODI);
      return data;
    }
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_MODI_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
  }
};
export const eliminar = async (id) => {
  try {
    const chequeEliminado = arregloCheques.find((cheque) => cheque.id === id);
    if (!chequeEliminado) return arregloCheques;

    arregloCheques = arregloCheques.filter((cheque) => cheque.id !== id);

    swal.showSuccess(HTTP_MSG_BAJA);
    return arregloCheques;
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_BAJA_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return arregloCheques;
  }
};
