const VITE_BACKEND_ID_EMPRESA_TEST = import.meta.env
  .VITE_BACKEND_ID_EMPRESA_TEST;

export const getToken = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let TOKEN = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      TOKEN = auxStateLogin.usuarioLogueado.usuario.token;
      return TOKEN;
    }
  }
  return {};
};

export const getTokenRefresh = () => {
  try {
    let auxStateLogin = localStorage.getItem('stateLogin');
    let tokenRefresh = null;

    if (auxStateLogin != null) {
      auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
      if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
        tokenRefresh = auxStateLogin.usuarioLogueado.usuario.tokenRefresco;
        return tokenRefresh;
      }
    }
  } catch (error) {
    console.log('localStorageService - getTokenRefresh - error:', error);
  }
  return null;
};

export const setLoguinRefresh = (token, tokenRefresh) => {
  try {
    let auxStateLogin = localStorage.getItem('stateLogin');
    if (auxStateLogin != null) {
      auxStateLogin = JSON.parse(auxStateLogin);
      auxStateLogin.usuarioLogueado.usuario.token = token;
      auxStateLogin.usuarioLogueado.usuario.tokenRefresco = tokenRefresh;

      localStorage.setItem('stateLogin', JSON.stringify(auxStateLogin));
    }
  } catch (error) {}
};

export const getEmpresaId = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      auxStateLogin = auxStateLogin.usuarioLogueado;
      if (auxStateLogin?.hasOwnProperty('empresa')) {
        auxStateLogin = auxStateLogin.empresa;
        if (auxStateLogin?.hasOwnProperty('id')) {
          return auxStateLogin.id;
        }
      }
    }
  }

  if (funcionHabilitada('ID_EMPRESA_TEST')) {
    return VITE_BACKEND_ID_EMPRESA_TEST;
  }

  return null;
};

export const getRol = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      auxStateLogin = auxStateLogin.usuarioLogueado;
      if (auxStateLogin.hasOwnProperty('usuario')) {
        auxStateLogin = auxStateLogin.usuario;
        return auxStateLogin.rol[0].descripcion;
      }
    }
  }
  return null;
};

export const getUsuario = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let USUARIO = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      USUARIO = auxStateLogin.usuarioLogueado.usuario.nombre;
      return USUARIO;
    }
  }

  return null;
};
export const getApellido = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let USUARIO = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      USUARIO = auxStateLogin.usuarioLogueado.persona?.apellido;
      return USUARIO;
    }
  }

  return null;
};
export const getNombre = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    //console.log('auxStateLogin: ', auxStateLogin);
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      if (
        auxStateLogin.usuarioLogueado.persona &&
        auxStateLogin.usuarioLogueado.persona.hasOwnProperty('nombre')
      ) {
        //if (auxStateLogin.usuarioLogueado.persona.hasOwnProperty('nombre')) {
        return auxStateLogin.usuarioLogueado.persona.nombre;
        //}
      }

      if (
        auxStateLogin.usuarioLogueado.empresa &&
        auxStateLogin.usuarioLogueado.empresa.hasOwnProperty('razonSocial')
      ) {
        return auxStateLogin.usuarioLogueado.empresa.razonSocial;
      }
    }
  }
  return null;
};

export const getMail = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  let USUARIO = null;

  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      USUARIO = auxStateLogin.usuarioLogueado.persona.email;
      return USUARIO;
    }
  }

  return null;
};

export const isRolEmpleador = () => {
  let ROL = getRol();
  if (ROL == 'EMPLEADOR') return true;
  return false;
};

const getFuncionalidades = () => {
  let auxStateLogin = localStorage.getItem('stateLogin');
  if (auxStateLogin != null) {
    auxStateLogin = JSON.parse(localStorage.getItem('stateLogin'));
    if (auxStateLogin.hasOwnProperty('usuarioLogueado')) {
      auxStateLogin = auxStateLogin.usuarioLogueado;
      if (auxStateLogin.hasOwnProperty('usuario')) {
        auxStateLogin = auxStateLogin.usuario;
        if (auxStateLogin.hasOwnProperty('funcionalidad')) {
          return auxStateLogin.funcionalidad;
        }
      }
    }
  }
  return [];
};

export const funcionHabilitada = (codigo) => {
  const vecFunc = getFuncionalidades();
  if (vecFunc.length > 0) {
    const aux = vecFunc.find((reg) => {
      return reg.descripcion === codigo;
    });
    if (aux) {
      return true;
    }
  }
  return false;
};

export const funcionEmpresaDatosModiHabilitada = () => {
  return funcionHabilitada('EMPRESA_DATOS_MODI');
};

export const funcionABMEmpresaHabilitada = () => {
  let result = -1;
  try {
    result = window.location.href.toLowerCase().indexOf('/registercompany');
  } catch (e) {
    console.log('funcionABMEmpresaHabilitada - ERROR: ', e);
  }

  return funcionHabilitada('EMPRESA_CONTACTO_DOMICILIO_ABM') || result > -1;
  //return funcionHabilitada('CONSULTA_EMPRESA_ALTA_MODI');
};

const localStorageService = {
  getToken: function () {
    return getToken();
  },
  getEmpresaId: function () {
    return getEmpresaId();
  },
  getRol: function () {
    return getRol();
  },
  getUsuario: function () {
    return getUsuario();
  },
  getApellido: function () {
    return getApellido();
  },
  getNombre: function () {
    return getNombre();
  },
  getMail: function () {
    return getMail();
  },
  isRolEmpleador: function () {
    return isRolEmpleador();
  },
  getTokenRefresh: function () {
    return getTokenRefresh();
  },
  setLoguinRefresh: function (token, tokenRefresh) {
    setLoguinRefresh(token, tokenRefresh);
  },
  getNombre: function () {
    return getNombre();
  },
  funcionHabilitada: function (codigo) {
    return funcionHabilitada(codigo);
  },
  funcionABMEmpresaHabilitada: function () {
    return funcionABMEmpresaHabilitada();
  },
  funcionEmpresaDatosModiHabilitada: function () {
    return funcionEmpresaDatosModiHabilitada();
  },
};

export default localStorageService;
