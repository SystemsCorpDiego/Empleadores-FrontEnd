import axios from 'axios';
import localStorageService from '@/components/localStorage/localStorageService';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Set config defaults when creating the instance
const oAxios = axios.create({
  baseURL: BACKEND_URL, //"http://127.0.0.1:8400/sigeco",
  timeout: 60000,
});

// Alter defaults after instance has been created
oAxios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
oAxios.defaults.headers.common['Access-Control-Allow-Headers'] =
  'POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Origin';
oAxios.defaults.headers.common['Content-Type'] = 'application/json';

oAxios.interceptors.request.use(
  (req) => {
    req.headers = {
      ...req.headers,
      Authorization: localStorageService.getToken(),
    };
    return req;
  },
  (error) => {
    console.log(
      `** oAxios.interceptors - REQUEST - ERROR - error: ${JSON.stringify(
        error,
      )}`,
    );
    return Promise.reject(error);
  },
);

oAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(
      `** oAxios.interceptors - RESPONSE - ERROR - error: ${JSON.stringify(
        error,
      )}`,
    );

    console.log('originalRequest:', originalRequest);

    if (error.response.status && error.response.status == 401) {
      console.log(
        '** oAxios.interceptors.response - HTTP-ERROR 401 - ERROR AUTH ',
      );

      let rta = await execTokenRefresh();
      console.log('execTokenRefresh - rta:', rta);
      if (rta) {
        rta = await execOriginalRequest(originalRequest);
        console.log('execOriginalRequest - rta:', rta);
        return rta;
      }
      console.log('oAxios.interceptors.response - GO LOGIN');
      window.location.href = '/';
      return error;
    }

    if (error.response.status == 404) {
      console.log('** oAxios.interceptors - RESPONSE - HTTP - ERROR 404');
      if (error.response.config.url) {
        console.log(
          '- URL INCORRECTA: ' +
            error.response.config.url +
            '. verificar que el Backend este activo',
        );
      }
    }

    if (error.response && error.response.data) {
      const oJsonResponse = error.response.data;
      console.log(
        '** oAxios.interceptors - RESPONSE - HTTP - oJsonResponse:' +
          JSON.stringify(oJsonResponse),
      );
    }

    error.status = error.response.status;
    console.log('*** Promise.reject(error) - OJOOO !!! ');
    return Promise.reject(error);
  },
);

const execTokenRefresh = async () => {
  const tokenRefresh = localStorageService.getTokenRefresh();
  if (tokenRefresh) {
    let data = JSON.stringify({
      tokenRefresco: tokenRefresh,
    });
    const rta = await oAxios
      .post('auth/login/token/refresh', data)
      .then((response) => {
        console.log('token/refresh - response:', response);
        localStorageService.setLoguinRefresh(
          response.data.token,
          response.data.tokenRefresco,
        );
        return true;
      })
      .catch((err) => {
        console.log(err);
        console.log(
          '** oAxios.interceptors.response - token/refresh:ERROR - VOY AL LOGUIN',
        );
        window.location.href = '/';
        return false;
      });
    return rta;
  } else {
    return false;
  }
};

const execOriginalRequest = async (originalRequest) => {
  const rta = await oAxios(originalRequest)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
  return rta;
};

export default oAxios;
