import { axiosCrud } from '@/components/axios/axiosCrud';
import formatter from '@/common/formatter';
import swal from '@/components/swal/swal';

const URL_ENTITY = '/empresa';
const HTTP_MSG_ALTA = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const arregloCuotas = [
  {
    convenioId: 1,
    id: 1,
    nro_cuota: '1',
    importeCuota: 15000.0,
    cheques: '12345/67890',
    totalCheques: 15000.0,
  },
  {
    convenioId: 1,
    id: 2,
    nro_cuota: '2',
    importeCuota: 15000.0,
    cheques: '22345/77890',
    totalCheques: 15000.0,
  },
  {
    convenioId: 1,
    id: 3,
    nro_cuota: '3',
    importeCuota: 15000.0,
    cheques: '32345/87890',
    totalCheques: 15000.0,
  },
  {
    convenioId: 1,
    id: 4,
    nro_cuota: '4',
    importeCuota: 15000.0,
    cheques: '42345/97890',
    totalCheques: 15000.0,
  },
];
/*
export const axiosCuotas = {
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
};*/
export const consultar = async (convenioId, empresaId) => {
  try {
    console.log(convenioId, empresaId);
    var empreID = '0';
    if (empresaId && empresaId != null) empreID = '' || empresaId;

    console.log('consultar - empreID: ', empreID);

    const URL_API = `${URL_ENTITY}/${empreID}/convenios/${convenioId}/cuotas`;
    console.log(URL_API);
    const data = await axiosCrud.consultar(URL_API);

    console.log(data);
    console.log(arregloCuotas);
    return data || [];
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
    console.log(registro);
    const data = {
      convenioId: 1,
      id: Math.random(100) * 1.2,
      numero: registro.numero,
      monto: 15000.0,
      cuota: 4,
    };
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
    const URL_API = `${URL_ENTITY}/${registro.id}`;
    //const data = await axiosCrud.actualizar(URL_API, registro);
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
    const URL_API = `${URL_ENTITY}/${id}`;
    //const data = await axiosCrud.eliminar(URL_API);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_BAJA);
      return data;
    }
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_BAJA_ERROR + ` (${URL_ENTITY} - status: ${error.status})`,
      error,
    );
  }
};
