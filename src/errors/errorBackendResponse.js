import swal from '@components/swal/swal';

const ERROR_BUSINESS = import.meta.env.VITE_ERROR_BUSINESS;
const ERROR_MESSAGE = import.meta.env.VITE_ERROR_MESSAGE;
const ERROR_BODY = import.meta.env.VITE_ERROR_BODY;

export const sigecoErrorHandler = (responseData) => {
  if (responseData) {
    if (responseData.tipo) {
      if (responseData.tipo === ERROR_BUSINESS) {
        swal.showError('' + responseData.descripcion);
      } else {
        swal.showError(`${ERROR_MESSAGE} ${responseData.ticket}`);
      }
    }
  }
};

export const errorBackendResponse = (error) => {
  console.log('errorBackendResponse() - error: ');
  console.log(error.toJSON());

  try {
    if (!error) {
      console.log('- Parametro error NULO ');
      swal.showError(`${ERROR_MESSAGE}`);
      return false;
    }

    if (error.response) {
      // The client was given an error response (5xx, 4xx)
      console.log('error.response: ');
      console.log(error.response);

      if (!error.response.data) {
        console.log('- error.response: No existe .data');
        console.log('error.response: ');
        console.log(error.response);
        swal.showError(`${ERROR_MESSAGE}`);
        return false;
      }

      let oJsonResponse = null;
      try {
        oJsonResponse = error.response.data;
      } catch (errorNew) {
        console.log('- ERROR cast Response a oJsonResponse: ');
        console.log('error.response.data: ');
        console.log(error.response.data);
        console.log(`${ERROR_BODY} : ${errorNew}`);
        swal.showError(`${ERROR_MESSAGE}`);
        return false;
      }

      if (
        !oJsonResponse.hasOwnProperty('ticket') ||
        !oJsonResponse.hasOwnProperty('tipo')
      ) {
        console.log('- Backend Response con formato INCORRECTO: ');
        console.log(oJsonResponse);
        console.log(`${ERROR_BODY} : ${oJsonResponse}`);
        swal.showError(`${ERROR_MESSAGE}`);
        return false;
      }

      if (oJsonResponse.tipo === ERROR_BUSINESS) {
        console.log('- oJsonResponse.tipo=ERROR_BUSINESS -> oJsonResponse: ');
        console.log(oJsonResponse);
        console.log(`${ERROR_BODY} : ${oJsonResponse}`);
        console.log('oJsonResponse.descripcion: ');
        console.log(oJsonResponse.descripcion);
        swal.showError('' + oJsonResponse.descripcion);
        return true;
      }

      swal.showError(`${ERROR_MESSAGE} ${oJsonResponse.ticket}`);
      console.log(
        'Ticket: ' +
          oJsonResponse.ticket +
          ' - Descripcion: ' +
          oJsonResponse.descripcion,
      );
      console.log('error.response: ');
      console.log(error.response);
      return true;
    } else if (error.request) {
      // The client never received a response, and the request was never left
      console.log('- Backend Response NULL - error.request :');
      console.log(error.request);

      console.log('error.request.status: ');
      console.log(error.request.status);

      swal.showError(`${ERROR_MESSAGE}`);
      return true;
    } else {
      // Anything else
      console.log('- Backend Response UNKNOWN: ');
      console.log('error:', error.message);
      swal.showError(`${ERROR_MESSAGE}`);
      return true;
    }
  } catch (error) {
    console.error(`${ERROR_BODY} : ${error}`);
    swal.showError(`${ERROR_MESSAGE}`);
  }
};
