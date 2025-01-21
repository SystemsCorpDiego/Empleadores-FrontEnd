import { axiosCrud } from '@components/axios/axiosCrud';
import { consultarAportesDDJJ } from '@/common/api/AportesApi';
import formatter from '@/common/formatter';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const URL_ENTITY = '/aportes';

export const axiosAportes = {
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

  consultarAportes: async function () {
    return consultarAportesDDJJ();
  },
};

export const consultar = async () => {
  try {
    const data = await axiosCrud.consultar(`${URL_ENTITY}/seteos/vigentes`);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const crear = async (registro) => {
  registro.camara = registro.camara == '' ? null : registro.camara;
  registro.categoria = registro.categoria == '' ? null : registro.categoria;
  try {
    registro.periodo_original = formatter.toFechaValida(
      registro.periodo_original,
    );
    registro.vigencia = formatter.toFechaValida(registro.vigencia);

    const data = await axiosCrud.crear(`${URL_ENTITY}/seteos`, registro);
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
  registro.camara = registro.camara == '' ? null : registro.camara;
  registro.categoria = registro.categoria == '' ? null : registro.categoria;
  try {
    console.log(registro);
    console.log(registro.periodo_original);
    registro.periodo_original = formatter.toFechaValida(
      registro.periodo_original,
    );
    registro.vigencia = formatter.toFechaValida(registro.vigencia);

    const response = await axiosCrud.actualizar(`${URL_ENTITY}/seteos`, registro);
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
    const response = await axiosCrud.eliminar(`${URL_ENTITY}/seteos`, id);
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

export const consultaCategoria = async () => {
  const URL = '/camara/categoria/'
  try{
    const response = await axiosCrud.consultar(URL);
    if (response) {
      return response
    } else {
      return false
    }
  } catch (error) {
    swal.showErrorBackEnd('Ocurrio un problema al querer obtener las camaras y sus categorias', error);
    return []
  }
};

export const consultaEntidades = async () => {
  const URL = '/aportes/'
  try{
    const response = await axiosCrud.consultar(URL);
    if (response) {
      return response
    } else {
      return false
    }
  } catch (error) {
    swal.showErrorBackEnd('Ocurrio un problema al querer obtener los tipos de aporte', error);
    return []
  }
};