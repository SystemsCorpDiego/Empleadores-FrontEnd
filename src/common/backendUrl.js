export const backendUrl = () => {
  // Extraer el contenido entre los corchetes
  try {
    //console.log('Axios.interceptors.request.use - window.location.hostname: ', window.location.hostname);
    //console.log('Axios.interceptors.request.use - window.location.host: ', window.location.host);
    //console.log('Axios.interceptors.request.use - window.location.origin: ', window.location.origin);
    //console.log('Axios.interceptors.request.use - VITE_BACKEND_URL: ',  import.meta.env.VITE_BACKEND_URL);

    //IE Polyfill
    if (!window.location.origin) {
      console.log('IE Polyfill - RUN');
      window.location.origin =
        window.location.protocol +
        '//' +
        window.location.hostname +
        (window.location.port ? ':' + window.location.port : '');
    }
    var BACKEND_URL = window.location.origin + import.meta.env.VITE_BACKEND_URL;
    if (import.meta.env.VITE_ES_LOCALHOST == '1') {
      BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    }

    return BACKEND_URL;
  } catch (error) {
    return 'ERROR-BACKEND_URL';
  }
};

export default backendUrl;
