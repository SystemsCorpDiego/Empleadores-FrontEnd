import { axiosCrud } from '@components/axios/axiosCrud';
import formatter from '@/common/formatter';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const URL_ENTITY = '/parametros-convenios';

export const axiosParametrosConvenios = {
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

export const parametrosMock = [
  {
    id: 1,
    cuit: '3045455566',
    antiguedad: 2,
    cuotas: 2,
    diasIntencion: 10,
    ventanilla: false,
    redlink: false,
    banelco: false,
    cheque: true,
    tasa: '0,23456',
    vigDesde: '2024-01-01',
    vigHasta: '2024-12-31',
  },
  {
    id: 2,
    cuit: '3056789012',
    antiguedad: 1,
    cuotas: 1,
    diasIntencion: 20,
    ventanilla: false,
    redlink: false,
    banelco: false,
    cheque: true,
    tasa: '012345',
    vigDesde: '2024-03-01',
    vigHasta: '2025-03-01',
  },
  {
    id: 3,
    cuit: '3067891234',
    antiguedad: 5,
    cuotas: 3,
    diasIntencion: 15,
    ventanilla: true,
    redlink: true,
    banelco: true,
    cheque: false,
    tasa: '0,56789',
    vigDesde: '2024-06-01',
    vigHasta: '2024-09-30',
  },
];

export const consultar = async () => {
  try {
    //const data = await axiosCrud.consultar(URL_ENTITY);
    //return data || [];
    console.log('axiosParametrosConvenios.consultar - parametrosMock:', parametrosMock);
    return parametrosMock || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const crear = async (registro) => {
  try {
    registro.periodo_original = formatter.toFechaValida(
      registro.periodo_original,
    );
    registro.vigencia = formatter.toFechaValida(registro.vigencia);

    const data = await axiosCrud.crear(URL_ENTITY, registro);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    }
    throw data;
  } catch (error) {
    console.log('axiosAjustes.crear - catch (error):', error);
    swal.showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return {};
  }
};

export const actualizar = async (registro) => {
  try {
    console.log(registro);
    console.log(registro.periodo_original);
    registro.periodo_original = formatter.toFechaValida(
      registro.periodo_original,
    );
    registro.vigencia = formatter.toFechaValida(registro.vigencia);

    const response = await axiosCrud.actualizar(URL_ENTITY, registro);
    if (response == true) {
      swal.showSuccess(HTTP_MSG_MODI);
      return true;
    }
    throw response;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};

export const eliminar = async (id) => {
  try {
    const response = await axiosCrud.eliminar(URL_ENTITY, id);
    if (response == true) {
      swal.showSuccess(HTTP_MSG_BAJA);
      return true;
    }
    throw response;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_BAJA_ERROR, error);
    return false;
  }
};
