import Swal from 'sweetalert2';
import { erroresFormat } from '../axios/erroresFormat';

const showSwallSuccess = (MESSAGE_HTTP, texto) => {
  let minSetting = {
    titulo: MESSAGE_HTTP,
  };
  if (texto) {
    minSetting.texto = texto;
  }

  let settings = getSettingSuccess(minSetting);
  Swal.fire(settings);
};

const showSwallSuccessWithConfirmButton = (MESSAGE_HTTP, redirectFunction) => {
  Swal.fire({
    icon: 'success',
    title: MESSAGE_HTTP,
    showConfirmButton: true,
  }).then((result) => {
    if (result.isConfirmed || result.isDismissed) {
      redirectFunction('/login'); // Llama a la función de redirección pasada como argumento
    }
  });
};

const showSwallSuccessWithGenericConfirmButton = (MESSAGE_HTTP) => {
  Swal.fire({
    icon: 'success',
    title: MESSAGE_HTTP,
    showConfirmButton: true,
  });
};

const showSwalError = (descripcion) => {
  try {
    console.log('showSwalError - descripcion:' + descripcion);
    Swal.fire({
      icon: 'error',
      title: 'Error de Validación',
      html: descripcion,
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    });
  } catch (error) {
    console.log('showSwalError-ERROR:');
    console.log(error);
  }
};

const showSwalWarning = (descripcion, esHtml) => {
  try {
    console.log('showSwalWarning - descripcion:' + descripcion);
    let conf = {
      icon: 'warning',
      title: 'Advertencia',
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
    };
    console.log('esHtml:', esHtml);
    if (esHtml) {
      conf.html = descripcion;
    } else {
      conf.text = descripcion;
    }
    console.log('conf:', conf);
    Swal.fire(conf);
  } catch (error) {
    console.log('showSwalWarning-ERROR:');
    console.log(error);
  }
};

const showSwalErrorBusiness = (descripcion) => {
  try {
    Swal.fire({
      icon: 'error',
      title: 'Error de Validación',
      html: erroresFormat(descripcion),
      showConfirmButton: true,
      confirmButtonText: 'Aceptar',
      //timer: 3000,
    });
  } catch (error) {
    console.log('showSwalError-ERROR:');
    console.log(error);
  }
};

const getSettingConfirm = (seteos) => {
  let settings = {
    title: seteos.titulo,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1A76D2',
    cancelButtonColor: '#6c757d',
    confirmButtonText: seteos.textoBtnOK,
  };
  if (seteos.esHtml) settings.html = seteos.texto;
  if (!seteos.esHtml) settings.text = seteos.texto;

  return settings;
};

const getSettingSuccess = (seteos) => {
  console.log('getSettingSuccess - seteos: ', seteos);
  let settings = null;
  if (seteos && seteos.hasOwnProperty('titulo')) {
    settings = {
      icon: 'success',
      showConfirmButton: false,
      timer: 2000,
      title: seteos.titulo,
    };

    if (seteos.hasOwnProperty('texto')) {
      if (seteos.hasOwnProperty('esHtml') && seteos.esHtml == true) {
        settings.html = seteos.texto;
      } else {
        settings.text = seteos.texto;
      }
    }
  }
  console.log('getSettingSuccess - settings: ', settings);
  return settings;
};

const showErrorBackEnd = async (HTTP_MSG, rta) => {
  const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;
  const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;

  try {
    console.log('showErrorBackEnd - rta:', rta);
    if (
      rta.request &&
      rta.request.responseType &&
      rta.request.responseType === 'blob' &&
      rta.response.data instanceof Blob &&
      rta.response.data.type &&
      rta.response.data.type.toLowerCase().indexOf('json') != -1
    ) {
      console.log('JSON.parse(await rta.response.data.text());.... ');
      let errorResponse = await rta.response.data.text();
      console.log('errorResponse: ', errorResponse);
      rta = JSON.parse(errorResponse);
    } else {
      if (rta.response && rta.response.data) {
        console.log(
          'showErrorBackEnd - VA A EJECUTAR: rta = rta.response.data; ???',
        );
        rta = rta.response.data;
      }
    }

    console.log('showErrorBackEnd - rta: ', rta);
    console.log('showErrorBackEnd - rta.data: ', rta.data);

    if (rta && rta.tipo && rta.descripcion && rta.ticket) {
      console.log('* showErrorBackEnd - con ticket');
      if (rta.tipo === ERROR_BUSINESS) {
        console.log('* showErrorBackEnd - ERROR_BUSINESS');
        showSwalErrorBusiness(rta.descripcion);
      } else {
        console.log('* showErrorBackEnd - NOOO ERROR_BUSINESS');
        showSwalError(`${ERROR_MESSAGE} ${rta.ticket}`); // confirm
      }
    } else {
      console.log('* showErrorBackEnd - NOOO ticket');
      console.log(rta);
      if (rta.code && rta.code == 'ECONNABORTED') {
        showSwalError(
          'Error de TimeOut en el Servidor.<br>Por favor realice alguna de las siguientes acciones:<br><br>1)Si intentó registrar información: consulte los datos para verificar el estado y vuelva a intentarlo de ser necesario.<br>2)Si intentó consultar información: por favor filtre la búsqueda.',
        );
      } else {
        showSwalError(HTTP_MSG);
      }
    }
  } catch (error) {
    console.log('showErrorBackEnd - catch() - error: ', error);
    showSwalError(HTTP_MSG);
  }
};

const swal = {
  showError: async function (descripcion) {
    return showSwalError(descripcion);
  },

  showErrorBusiness: async function (descripcion) {
    return showSwalErrorBusiness(descripcion);
  },

  showSuccess: async function (descripcion, texto) {
    return showSwallSuccess(descripcion, texto);
  },

  showSuccesConfirmButton: async function (descripcion, redirectFunction) {
    return showSwallSuccessWithConfirmButton(descripcion, redirectFunction);
  },

  showWarning: async function (descripcion, esHtml) {
    return showSwalWarning(descripcion, esHtml);
  },
  showErrorBackEnd: async function (HTTP_MSG, rta) {
    return showErrorBackEnd(HTTP_MSG, rta);
  },

  showSuccesGenericConfirmButton: async function (descripcion) {
    return showSwallSuccessWithGenericConfirmButton(descripcion);
  },

  getSettingConfirm: function (seteos) {
    return getSettingConfirm(seteos);
  },
  getSettingSuccess: function (seteos) {
    return getSettingSuccess(seteos);
  },
};

export default swal;
