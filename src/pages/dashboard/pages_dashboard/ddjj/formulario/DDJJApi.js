import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@components/axios/axiosCrud';
import { presentar } from '@/pages/dashboard/pages_dashboard/ddjj/DDJJCommonApi';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

export const obtenerAfiliados = async (cuil) => {
  const URL = `/afiliados/cuil/${cuil}`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const obtenerCamaras = async () => {
  const URL = '/camara';
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const obtenerCategorias = async () => {
  const URL = 'camara/categoria';
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const obtenerPlantaEmpresas = async (empresaId) => {
  const URL = `/empresa/${empresaId}/domicilio/planta`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const obtenerMiDeclaracionJurada = async (empresaId, ddjjId) => {
  const URL = `/empresa/${empresaId}/ddjj/${ddjjId}`;
  try {
    const data = await axiosCrud.consultar(URL);
    return data || {};
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return [];
  }
};

export const crearAltaDeclaracionJurada = async (empresaId, registro) => {
  console.log(registro);
  const URL = `/empresa/${empresaId}/ddjj`;
  try {
    const data = await axiosCrud.crear(URL, registro);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    }
    throw data;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return null;
  }
};

export const actualizarDeclaracionJurada = async (empresaId, registro) => {
  console.log(registro);
  const URL = `/empresa/${empresaId}/ddjj`;
  console.log(URL);
  console.log('DENTRO DE LA FUNCION ACTUALIZAR DDJJ ', registro);
  try {
    const response = await axiosCrud.actualizar(URL, registro);
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

export const validarAltaDeclaracionJurada = async (empresaId, registro) => {
  const URL = `/empresa/${empresaId}/ddjj/validar`;
  try {
    const validarDDJJResponse = await oAxios.post(URL, registro);
    return validarDDJJResponse.data || [];
  } catch (error) {
    if (error.response && error.response.data) {
      const { errores, codigo, descripcion, ticket, tipo } =
        error.response.data;
      return errores || [];
    }
  }
};

export const validarCuiles = async (empresaId, cuiles) => {
  const URL = `/empresa/${empresaId}/ddjj/upload/nomina/validaCuil`;
  try {
    const validarCuilesResponse = await oAxios.post(URL, cuiles);
    return validarCuilesResponse.data || [];
  } catch (error) {
    if (error.response && error.response.data) {
      const { errores, codigo, descripcion, ticket, tipo } =
        error.response.data;
      return errores || [];
    }
  }
};

export const validarCuil = async (cuil) => {
  const URL = `/comun/cui/${cuil}/validar`;
  try {
    const response = await oAxios.get(URL);
    return response.data || false;
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
    return false;
  }
};

const obtenerPeriodoAnterior = async (empresaId, periodo) => {
  let URL = `/empresa/${empresaId}/ddjj/periodo-anterior/`;
  if (periodo !== null) {
    let dateParts = periodo.split('-');
    dateParts[2] = '01';
    const periodoDiaUno = dateParts.join('-');
    URL += `?periodo=${periodoDiaUno}`;
  }

  try {
    const data = await axiosCrud.consultar(URL);
    return data || null;
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return null;
  }
};

const actualizarNombreApellido = async (registro) => {
  console.log('actualizarNombreApellido - registro:', registro);

  const URL = `/afiliados`;

  try {
    const response = await axiosCrud.crear(URL, registro);

    console.log('actualizarNombreApellido - response:', response);

    if (response && response.id) {
      swal.showSuccess(
        HTTP_MSG_MODI,
        'El cambio queda pendiente de validación del area afiliaciones',
      );
      return true;
    }
    throw response;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};

export const infoPeriodoConsulta = async (empresaId, periodo) => {
  const URL = `/empresa/${empresaId}/ddjj/periodo/${periodo}/info`;
  try {
    const data = await axiosCrud.consultar(URL);
    if (data && data.estado) return data;
    return null;
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`,
      error,
    );
    return null;
  }
};

export const axiosDDJJ = {
  getCamaras: async function () {
    return obtenerCamaras();
  },

  getCategorias: async function () {
    return obtenerCategorias();
  },

  getAfiliado: async function (cuil) {
    return obtenerAfiliados(cuil);
  },

  getPlantas: async function (empresaId) {
    return obtenerPlantaEmpresas(empresaId);
  },

  getDDJJ: async function (empresaId, ddjjId) {
    return obtenerMiDeclaracionJurada(empresaId, ddjjId);
  },

  crear: async function (empresaId, registro) {
    return crearAltaDeclaracionJurada(empresaId, registro);
  },

  actualizar: async function (empresaId, registro) {
    return actualizarDeclaracionJurada(empresaId, registro);
  },

  validar: async function (empresaId, registro) {
    return validarAltaDeclaracionJurada(empresaId, registro);
  },
  validarCuiles: async function (empresaId, cuiles) {
    return validarCuiles(empresaId, cuiles);
  },
  validarCuil: async function (cuil) {
    return validarCuil(cuil);
  },
  presentar: async function (empresaId, ddjjId) {
    return presentar(empresaId, ddjjId);
  },
  getPeriodoAnterior: async function (empresaId, periodo) {
    return obtenerPeriodoAnterior(empresaId, periodo);
  },
  actualizarNombreApellido: async function (registro) {
    return actualizarNombreApellido(registro);
  },
  infoPeriodoConsulta: async function (empresaId, periodo) {
    return infoPeriodoConsulta(empresaId, periodo);
  },
};
