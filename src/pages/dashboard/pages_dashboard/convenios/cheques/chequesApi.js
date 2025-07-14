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

let arregloCheques = [
    { convenioId: 1, id: 1, numero: '123', monto: 5000.0, cuota: 2 },
    { convenioId: 1, id: 2, numero: '123', monto: 5000.0, cuota: 2 },
    { convenioId: 1, id: 3, numero: '123', monto: 5000.0, cuota: 2 },
  ];

export const axiosCheques = {
  consultar: async function (convenioId, cuotaId, empresaId) {
    return consultar(convenioId, cuotaId, empresaId);
  },

  crear: async function (chequeBody, cuota, idConvenio, empresaId) {
    return crear(chequeBody, cuota, idConvenio, empresaId);
  },

  actualizar: async function (chequeBody, empresaId, convenioId, cuotaId, chequeId) {
    return actualizar(chequeBody, empresaId, convenioId, cuotaId, chequeId);
  },

  eliminar: async function (empresaId,convenioId,cuotaId,chequeId) {
    return eliminar(empresaId,convenioId,cuotaId,chequeId);
  },
};
export const consultar = async (convenioId, cuotaId, empresaId) => {
  try {
    
    const URL_API = `${URL_ENTITY}/${empresaId}/convenios/${convenioId}/cuotas/${cuotaId}/cheques`;
    
    const data = await axiosCrud.consultar(URL_API);
    console.log(data);
    return data || [];
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` ( status: ${error.status})`,
      error,
    );
    return [];
  }
};
export const crear = async (chequeBody, cuota, idConvenio, empresaId) => {
  const URL_API = `/empresa/${empresaId}/convenios/${idConvenio}/cuotas/${cuota}/cheques`
  try {
    
    const body = {
      'numero' : chequeBody.numero,
      'fecha' : chequeBody.fecha,
      'importe': parseFloat(chequeBody.importe).toFixed(2),
      'estado': chequeBody.estado, // Asegúrate de que el estado esté definido en chequeBody
    }
     //'importe' :parseInt(chequeBody.importe, 10)}
    
      console.log(body)
      const data = await axiosCrud.crear(URL_API, chequeBody);
    
    if (data && data.id) {
      await consultar(idConvenio, cuota, empresaId);
      swal.showSuccess(HTTP_MSG_ALTA);
      return data;
    } else {
      swal.showErrorBackEnd(HTTP_MSG_ALTA_ERROR, data);
    }
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_ALTA_ERROR + ` (${URL_API} - status: ${error.status})`,
      error,
    );
  }
};
export const actualizar = async (chequeBody, empresaId, convenioId, cuotaId, chequeId) => {
  const URL_API = `/empresa/${empresaId}/convenios/${convenioId}/cuotas/${cuotaId}/cheques`
  try {
    
    console.log(chequeBody)
    console.log(chequeId)
    console.log(chequeBody.importe)
    const body = {
      'numero' : chequeBody.numero,
      'fecha' : chequeBody.fecha,
      'importe': chequeBody.importe,//parseFloat(chequeBody.importe),
      'estado': chequeBody.estado, // Asegúrate de que el estado esté definido en chequeBody
      'id' : chequeId
    }

    const data = await axiosCrud.actualizar(URL_API, body);
    if (data === false) {
      swal.showErrorBackEnd(
        HTTP_MSG_MODI_ERROR + ` (${URL_API} - status: ${error.status})`,
        error,
      );
    } else {
      swal.showSuccess("Cheque actualizado correctamente");
    }



    return data;
    
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_MODI_ERROR + ` (${URL_API} - status: ${error.status})`,
      error,
    );
  }
};
export const eliminar = async (empresaId,convenioId,cuotaId,chequeId) => {
  const URL_API = `/empresa/${empresaId}/convenios/${convenioId}/cuotas/${cuotaId}/cheques`
  await axiosCrud.eliminar(URL_API,chequeId);
  
  
};
