import oAxios from '@components/axios/axiosInstace';
import { axiosCrud } from '@/components/axios/axiosCrud';
import swal from '@/components/swal/swal';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const VITE_HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

const ordenaGrillaPeriodo = (response) => {
  console.log('response', response.declaracionesJuradas);
  if (
    response.declaracionesJuradas !== null ||
    response.declaracionesJuradas.length !== 0
  ) {
    const agrupado = response.declaracionesJuradas.reduce((acc, curr) => {
      const clave = `${curr.id}`;
      if (!acc[clave]) {
        acc[clave] = {
          id: curr.id,
          convenioDdjjId: curr.convenioDdjjId,
          periodo: curr.periodo,
          rectificativa: curr.rectificativa,
        };
      }
      acc[clave][curr.aporteDescripcion] = curr.importe;
      acc[clave].importeTotal =
        (acc[clave].importeTotal || 0) + curr.importeTotal;
      acc[clave].intereses = (acc[clave].intereses || 0) + curr.intereses;
      return acc;
    }, {});

    console.log('agrupado', agrupado);
    const resultado = Object.values(agrupado);

    response.declaracionesJuradas = resultado;
  } else {
    response.declaracionesJuradas = [];
  }
  if (response.actas === null || response.actas.length === 0) {
    response.actas = [];
  }
  if (response.saldosAFavor === null || response.saldosAFavor.length === 0) {
    response.saldosAFavor = [];
  }
  return response;
};

export const getGestionDeuda = async (empresa_id, entidad) => {
  const URL = `/empresa/${empresa_id}/deuda/entidad/${entidad}`;
  const response = await axiosCrud.consultar(URL);
  console.log(response);
  if (
    response &&
    response.declaracionesJuradas &&
    response.actas &&
    response.saldosAFavor &&
    response.declaracionesJuradas.length === 0 &&
    response.actas.length === 0
  ) {
    Swal.fire({
      icon: 'info',
      title: 'Sin Deuda',
      text: 'No se registra deuda al día de la fecha',
    });
  }
  return response;
};

export const getGestionEditar = async (empresa_id, convenioId) => {
  const URL = `/empresa/${empresa_id}/convenios/${convenioId}/deudaDto`;

  try {
    const response = await axiosCrud.consultar(URL);
    return response;
  } catch (error) {
    console.error('Error capturado en getGestionEditar:', error);

    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);

    return null;
  }

  //return emuRespuesta
};

export const getDeclaracionesJuradas = async (empresa_id, entidad) => {
  try {
    const response = await getGestionDeuda(empresa_id, entidad);
    const grilaOrdenada = ordenaGrillaPeriodo(response);
    return grilaOrdenada;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    throw error;
  }
};

export const getDetalleConvenio = async (empresa_id, body) => {
  try {
    const URL = `/empresa/${empresa_id}/convenios/calcular-cuota`;
    console.log('body de detalle', body);
    if (
      body.fechaIntencionPago !== null &&
      body.fechaIntencionPago !== 'Invalid Date' &&
      body.importeDeuda > 0
    ) {
      console.log('body', body);
      const response = await axiosCrud.crear(URL, body);
      return response;
    }
    return {
      importeDeuda: 0,
      cantidadCuota: 1,
      fechaIntencionPago: '',
      importeCuota: 0,
      importeInteresTotal: 0,
    };
    //const URL = `/empresa/${empresa_id}/gestion-deuda/${entidad}/detalle-convenio`;
    //const reponse = axiosCrud.crear(URL,body)
    //return response;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    throw error;
  }
};

export const generarConvenio = async (idEmpresa, bodyConvenio) => {
  try {
    const URL = `/empresa/${idEmpresa}/convenios`;
    const response = await axiosCrud.crear(URL, bodyConvenio);
    console.log('response', response);
    if (response && response.id) {
      console.log('Convenio generado:', response);
      return true;
    } else {
      return response; //Envia en el response el mensaje de error a generarConvenio de empresaHelper.js
    }
  } catch (error) {
    console.error('Error al generar el convenio:', error);
    throw error;
  }
};

const getDeclaracionesJuradasEditar = async (empresa_id, convenioId) => {
  try {
    //const empresa_id = localStorage.getItem('empresaId');
    const response = await getGestionEditar(empresa_id, convenioId);
    console.log('response', response);

    const grilaOrdenada = ordenaGrillaPeriodo(response);
    //const grilaOrdenada = ordenaGrillaPeriodo(emuRespuesta);
    console.log('grilaOrdenada', grilaOrdenada);
    return grilaOrdenada;
  } catch (error) {
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    throw error;
  }
};

const putActualizarConvenio = async (empresa_id, convenioId, body) => {
  try {
    const URL = `/empresa/${empresa_id}/convenios`;
    if (body.hasOwnProperty('entidad')) {
      delete body.entidad;
    }
    const response = await axiosCrud.actualizar(URL, body, convenioId);
    console.log('response', response);
    if (response === true) {
      return true;
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.descripcion,
        confirmButtonText: 'Aceptar',
      });
      throw new Error(HTTP_MSG_MODI_ERROR);
    }
  } catch (error) {
    throw error;
  }
};

const getEmpresaByCuit = async (cuit, empresas) => {
  try {
    //console.log('getEmpresaByCuit - cuit:', cuit);
    //const URL = `/empresa`;

    let response = empresas;
    if (response === null || response === undefined) {
      try {
        response = await axiosGestionDeudas.getEmpresas();
      } catch (error) {
        throw new Error('Error al obtener las empresas: ' + error.message);
      }
    }
    console.log('response', response);
    if (response && response.length > 0) {
      const empresaEncontrada = response.find((e) => e.cuit == cuit);
      console.log('empresaEncontrada', empresaEncontrada);
      if (!empresaEncontrada) {
        throw new Error('No se encontró la empresa con el CUIT proporcionado.');
      }
      return empresaEncontrada.id ? empresaEncontrada.id : null;
    } else {
      throw new Error('No se encontró la empresa con el CUIT proporcionado.');
    }
  } catch (error) {
    throw error;
  }
};

const getEmpresaByNombre = async (nombreEmpresa, empresas) => {
  try {
    //console.log('getEmpresaByCuit - cuit:', cuit);

    const response = empresas;
    console.log('response', response);
    if (response && response.length > 0) {
      const empresaEncontrada = response.find(
        (e) => e.razonSocial == nombreEmpresa,
      );
      console.log('empresaEncontrada', empresaEncontrada);
      if (!empresaEncontrada) {
        throw new Error('No se encontró la empresa con el CUIT proporcionado.');
      }
      return empresaEncontrada.id ? empresaEncontrada.id : null;
    } else {
      throw new Error('No se encontró la empresa con el CUIT proporcionado.');
    }
  } catch (error) {
    throw error;
  }
};

const getEmpresas = async () => {
  try {
    const URL = `/empresa`;
    const response = await axiosCrud.consultar(URL);
    console.log('response', response);
    if (response && response.length > 0) {
      return response;
    } else {
      throw new Error('No se encontraron empresas.');
    }
  } catch (error) {
    throw error;
  }
};

const downloadDeuda = async () => {
  try {
    const uriApi = `/deuda/`;
    const response = await axiosCrud.consultar(uriApi);
    console.log('response', response);
    if (!Array.isArray(response))
      throw new Error('Formato de Deudas inesperado');

    const DEUDA_INFO = response.map((item) => ({
      id: item.id,
      cuit: item.cuit,
      entidad: item.entidad,
      periodo: item.periodo,
      aporte: item.aporte,
      aporteDescripcion: item.aporteDescripcion,
      ddjj_secuencia: item.ddjj_secuencia,
      aporte_importe: item.aporte_importe,
      interes: item.interes,
      vencimiento: item.vencimiento,
      boletaPago_secuencia: item.boletaPago_secuencia,
      aporte_pago: item.aporte_pago,
      aporte_pago_fecha_info: item.aporte_pago_fecha_info,
      acta_nro: item.acta_nro,
      acta_pago: item.acta_pago,
      convenio_nro: item.convenio_nro,
      convenio_pago: item.convenio_pago,

      ddjj_id: item.ddjj_id,
      boleta_id: item.boleta_id,
      acta_id: item.acta_id,
      convenio_id: item.convenio_id,
    }));

    const HEADER_MAP = {
      id: 'ID',
      cuit: 'CUIT',
      entidad: 'Entidad',
      periodo: 'Periodo',
      aporte: 'Aporte',
      aporteDescripcion: 'Descripcipn Aporte',
      ddjj_secuencia: 'DDJJ Nro.',
      aporte_importe: 'Importe Aporte',
      interes: 'Interes',
      vencimiento: 'Vencimiento',
      boletaPago_secuencia: 'Boleta Pago Nro.',
      aporte_pago: 'Pago',
      aporte_pago_fecha_info: 'Fecha Pago',

      acta_nro: 'Acta Nro.',
      acta_pago: 'Acta Pago',
      convenio_nro: 'Convenio Nro.',
      convenio_pago: 'Convenio Pago',

      ddjj_id: 'DDJJ ID',
      boleta_id: 'Boleta ID',
      acta_id: 'Acta ID',
      convenio_id: 'Convenio ID',
    };

    const headers = Object.keys(HEADER_MAP);
    const headerLabels = headers.map((key) => HEADER_MAP[key]);

    const csvContent = [
      headerLabels.join(';'), // encabezados legibles
      ...DEUDA_INFO.map((r) =>
        headers
          .map((h) => {
            let value = r[h] ?? '';

            // Si es numérico (o string numérico) y contiene punto decimal
            if (!isNaN(value) && value.toString().includes('.')) {
              value = value.toString().replace('.', ',');
            }

            // Escapar comillas y devolver con comillas dobles
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(';'),
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deudaTotal.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return response;
  } catch (error) {
    //const HTTP_MSG =
    //  HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    //throw error;
    console.error('Error generando CSV:', error);
    alert('Ocurrió un error al descargar las cuotas del convenio.');
  }
};

const downloadExcel = async () => {
  try {
    const urlApi = `/deuda/`;
    const response = await axiosCrud.consultar(urlApi);
    console.log('response', response);
    if (!Array.isArray(response))
      throw new Error('Formato de Deudas inesperado');

    const DEUDA_INFO = response.map((item) => ({
      ID: item.id,
      CUIT: item.cuit,
      Entidad: item.entidad,
      Periodo: item.periodo,
      Aporte: item.aporte,
      'Descripción Aporte': item.aporteDescripcion,
      'DDJJ Nro.': item.ddjj_secuencia,
      'Importe Aporte': item.aporte_importe,
      Interés: item.interes,
      Vencimiento: item.vencimiento,
      'Boleta Pago Nro.': item.boletaPago_secuencia,
      Pago: item.aporte_pago,
      'Fecha Pago': item.aporte_pago_fecha_info,
      'Acta Nro.': item.acta_nro,
      'Acta Pago': item.acta_pago,
      'Convenio Nro.': item.convenio_nro,
      'Convenio Pago': item.convenio_pago,

      'DDJJ ID': item.ddjj_id,
      'Boleta ID': item.boleta_id,
      'Acta ID': item.acta_id,
      'Convenio ID': item.convenio_id,
    }));

    const worksheet = XLSX.utils.json_to_sheet(DEUDA_INFO);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Deuda');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deudaTotal.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generando Excel:', error);
    alert('Ocurrió un error al descargar el archivo Excel.');
  }
};

export const getParametrosConvenio = async (CUIT_EMPRESA) => {
  const mockParametros = {
    cuotas: 6,
    diasIntencion: 30,
    mediosDePago: [
      'CHEQUE'
    ],
  }
  try {
    if (CUIT_EMPRESA) {
      const response = await axiosCrud.consultar(`/convenio-seteo/cuit/${CUIT_EMPRESA}`);
      
      console.log('Parametros de convenio:', response);

      if (response === null || Object.keys(response).length === 0) {
        // Esta condicion la utilizo por si salió un mensaje antes de este error
        // Para que no se solapen
        if(Swal.isVisible()) {
          return null;
        }
        swal.showErrorBusiness(
          'El cuit no tiene parámetros de convenio configurados.',
        );
        return null
      }
      return response;
    }

  } catch (error) {
    console.error('Error capturado en getParametrosConvenio:', error);
    const HTTP_MSG =
      HTTP_MSG_CONSUL_ERROR + ` (${URL} - status: ${error.status})`;
    swal.showErrorBackEnd(HTTP_MSG, error);

    return null;
  }
};

export const axiosGestionDeudas = {
  getDeclaracionesJuradas,
  getDetalleConvenio,
  getDeclaracionesJuradasEditar,
  putActualizarConvenio,
  getEmpresaByCuit,
  getEmpresaByNombre,
  getEmpresas,
  generarConvenio,
  downloadDeuda,
  downloadExcel,
  getParametrosConvenio
};
