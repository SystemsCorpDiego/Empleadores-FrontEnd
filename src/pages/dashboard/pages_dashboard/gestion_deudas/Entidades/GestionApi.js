import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@/components/axios/axiosCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const HTTP_MSG_MODI = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;

const emuRespuesta = {
  boletas: [
    {
      id: 97,
      periodo: '2024-04-01',
      numero_boleta: 10,
      concepto: 'Cuota Social',
      totalConcepto: 20.0,
      interes: 176.8,
      total_final: 196.8,
    },
    {
      id: 98,
      periodo: '2024-04-01',
      numero_boleta: 10,
      concepto: 'Cuota Social',
      totalConcepto: 20.0,
      interes: 176.8,
      total_final: 196.8,
    },
  ],
  actas: [
    {
      id: 95,
      estadoDeuda: 'PENDIENTE',
      nroActa: '123',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 100,
      estadoDeuda: 'PENDIENTE',
      nroActa: '124',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 101,
      estadoDeuda: 'PENDIENTE',
      nroActa: '125',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 102,
      estadoDeuda: 'PENDIENTE',
      nroActa: '126',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 103,
      estadoDeuda: 'PENDIENTE',
      nroActa: '127',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 104,
      estadoDeuda: 'PENDIENTE',
      nroActa: '128',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 105,
      estadoDeuda: 'PENDIENTE',
      nroActa: '129',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
  ],
  convenios: [
    {
      id: 1,
      estado: 'PENDIENTE',
      nroConvenio: 1,
      nroCuota: 2,
      totalCuota: 234,
      intereses: 42,
      totalActualizado: 276,
    },
    {
      id: 2,
      estado: 'PENDIENTE',
      nroConvenio: 1,
      nroCuota: 3,
      totalCuota: 234,
      intereses: 42,
      totalActualizado: 276,
    },
  ],
  saldoAFavor: 2000,
};
const emuRespuestaOSPIM = {
  boletas: [
    {
      id: 97,
      periodo: '2024-04-01',
      numero_boleta: 10,
      concepto: 'Cuota Social',
      totalConcepto: 20.0,
      interes: 126.8,
      total_final: 146.8,
    },
    {
      id: 98,
      periodo: '2024-04-01',
      numero_boleta: 10,
      concepto: 'Cuota Social',
      totalConcepto: 20.0,
      interes: 126.8,
      total_final: 146.8,
    },
  ],
  actas: [
    {
      id: 95,
      estadoDeuda: 'PENDIENTE',
      nroActa: '123',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 13.0,
      importeTotal: 136.0,
    },
    {
      id: 100,
      estadoDeuda: 'PENDIENTE',
      nroActa: '124',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 13.0,
      importeTotal: 136.0,
    },
    {
      id: 103,
      estadoDeuda: 'PENDIENTE',
      nroActa: '127',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 104,
      estadoDeuda: 'PENDIENTE',
      nroActa: '128',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 105,
      estadoDeuda: 'PENDIENTE',
      nroActa: '129',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
  ],
  convenios: [
    {
      id: 1,
      estado: 'PENDIENTE',
      nroConvenio: 1,
      nroCuota: 2,
      totalCuota: 234,
      intereses: 42,
      totalActualizado: 276,
    },
    {
      id: 2,
      estado: 'PENDIENTE',
      nroConvenio: 1,
      nroCuota: 3,
      totalCuota: 234,
      intereses: 42,
      totalActualizado: 276,
    },
  ],
  saldoAFavor: 2000,
};
const emuRespuestaAMTIMA = {
  boletas: [
    {
      id: 97,
      periodo: '2024-04-01',
      numero_boleta: 10,
      concepto: 'Cuota Social',
      totalConcepto: 20.0,
      interes: 176.8,
      total_final: 196.8,
    },
    {
      id: 98,
      periodo: '2024-04-01',
      numero_boleta: 10,
      concepto: 'Cuota Social',
      totalConcepto: 20.0,
      interes: 176.8,
      total_final: 196.8,
    },
    {
      id: 99,
      periodo: '2024-04-01',
      numero_boleta: 10,
      concepto: 'Cuota Social',
      totalConcepto: 20.0,
      interes: 176.8,
      total_final: 196.8,
    },
  ],
  actas: [
    {
      id: 95,
      estadoDeuda: 'PENDIENTE',
      nroActa: '123',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 100,
      estadoDeuda: 'PENDIENTE',
      nroActa: '124',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
    {
      id: 101,
      estadoDeuda: 'PENDIENTE',
      nroActa: '125',
      fechaActa: '2024-05-30',
      importe: 123.0,
      intereses: 23.0,
      importeTotal: 146.0,
    },
  ],
  convenios: [
    {
      id: 1,
      estado: 'PENDIENTE',
      nroConvenio: 1,
      nroCuota: 2,
      totalCuota: 234,
      intereses: 42,
      totalActualizado: 276,
    },
    {
      id: 2,
      estado: 'PENDIENTE',
      nroConvenio: 1,
      nroCuota: 3,
      totalCuota: 234,
      intereses: 42,
      totalActualizado: 276,
    },
  ],
  saldoAFavor: 2000,
};
const emuRespuestaDetalleConvenio = {
  importeDeDeuda: 33000,
  interesesDeFinanciacion: 230,
  saldoAFavor: 200,
  saldoAFavorUtilizado: 200,
  totalAPagar: 33030,
  cantidadCuotas: 3,
  detalleCuota: [
    {
      numero: 1,
      valor: 11010,
      vencimiento: '21/07/2024',
    },
    {
      numero: 2,
      valor: 11010,
      vencimiento: '21/08/2024',
    },
    {
      numero: 3,
      valor: 11010,
      vencimiento: '21/08/2024',
    },
  ],
};

const bodyConvenio = {
  actas: [1, 2, 3], //acta_id
  periodos: [], //fecha o id boleta o id DDJJ
  cantCuotas: 1,
  fechaIntencionDePago: '2024-01-31',
  usarSaldoAFavor: true,
};

export const getBoletas = async (empresa_id, entidad) => {
  try {
    const URL = `/empresa/${empresa_id}/boletas/gestion-deuda/${entidad}`;
    //const response = axiosCrud.consultar(URL);
    //return response;
    switch (entidad) {
      case 'AMTIMA':
        return emuRespuestaAMTIMA;
      case 'OSPIM':
        return emuRespuestaOSPIM;
      case 'UOMA':
        return emuRespuesta;
      default:
        console.log('Entidad invalida');
    }

    return emuRespuesta;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
    //sacar cuando este el back

    //sacar cuando este el back
  }
};

export const getBoletasUsuarioInterno = async (entidad) => {
  const URL = `/empresa/boletas/gestion-deuda/${entidad}`;
  //const response = axiosCrud.consultar(URL);
  //return response;
  switch (entidad) {
    case 'AMTIMA':
      return emuRespuestaAMTIMA;
    case 'OSPIM':
      return emuRespuestaOSPIM;
    case 'UOMA':
      return emuRespuesta;
    default:
      console.log('Entidad invalida');
  }

  return emuRespuesta;
};

export const getDetalleConvenio = async (empresa_id, entidad, body) => {
  try {
    const URL = `/empresa/${empresa_id}/gestion-deuda/${entidad}/detalle-convenio`;
    //const reponse = axiosCrud.crear(URL,body)
    //return response;
    return emuRespuestaDetalleConvenio;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

export const generarConvenio = async (empresa_id, body) => {
  try {
    const URL = `empleadores/empresa/${idEmpresa}/deuda/entidad/${codigoEntidad}/convenio`;
    //const response = axiosCrud.crear(URL,body);
    //return reponse;
    return 'OK';
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);
  }
};

export const axiosGestionDeudas = {
  getBoletas,
  getDetalleConvenio,
};
