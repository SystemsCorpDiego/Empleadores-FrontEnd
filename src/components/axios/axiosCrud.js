import oAxios from '@components/axios/axiosInstace';

export const axiosCrud = {
  consultar: async function (UrlApi) {
    return axiosConsultar(UrlApi);
  },

  crear: async function (UrlApi, oEntidad) {
    return axiosCrear(UrlApi, oEntidad);
  },

  crearN: async function (UrlApi, oEntidad) {
    return axiosCrearN(UrlApi, oEntidad);
  },

  crearFormData: async function (UrlApi, oEntidad) {
    return axiosCrearFormData(UrlApi, oEntidad);
  },

  actualizar: async function (UrlApi, oEntidad, id) {
    return axiosActualizar(UrlApi, oEntidad, id);
  },

  actualizarN: async function (UrlApi, oEntidad) {
    return axiosActualizar(UrlApi, oEntidad);
  },

  eliminar: async function (UrlApi, id) {
    return axiosEliminar(UrlApi, id);
  },
  patch: async function (UrlApi, oEntidad) {
    return axiosPatch(UrlApi, oEntidad);
  },
};

export const axiosConsultar = async (UrlApi) => {
  try {
    const response = await oAxios.get(UrlApi);
    if (response.status != 200 && response.status != 204) {
      throw response;
    }
    const data = response.data || {};
    return data;
  } catch (error) {
    console.log(`axiosCrud.consultar() - ERROR - UrlApi: ${UrlApi} `);
    throw error;
  }
};

export const axiosCrear = async (UrlApi, oEntidad) => {
  try {
    var auxEntidad = oEntidad;
    if (!oEntidad) {
      auxEntidad = {};
    }
    const response = await oAxios.post(UrlApi, auxEntidad);
    //const response = await oAxios.post(UrlApi, oEntidad);
    if (response.status !== 201 && response.status !== 200) {
      console.log(
        `axiosCrud.crear() - ERROR 2 - UrlApi: ${UrlApi} - response.status !== 201 - response: ${JSON.stringify(
          response,
        )}`,
      );
      return {};
    }
    return response.data || {};
  } catch (error) {
    console.log('axiosCrud.crear() - catch() - ');
    if (error && error.response && error.response.data) {
      console.log('Este es el error : ', error);
      return error.response.data;
    } else {
      console.log(
        'axiosCrud.crear() - catch() - error: ' + JSON.stringify(error),
      );
      return {};
    }
  }
};

export const axiosCrearFormData = async (UrlApi, oEntidad) => {
  try {
    const response = await oAxios.post(UrlApi, oEntidad, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 201 && response.status !== 200) {
      console.log(
        `axiosCrud.crear() - ERROR 2 - UrlApi: ${UrlApi} - response.status !== 201 - response: ${JSON.stringify(
          response,
        )}`,
      );
      return response;
    }
    return response.data || {};
  } catch (error) {
    console.log('axiosCrud.crear() - catch() - ');
    if (error && error.response && error.response.data) {
      console.log('Este es el error : ', error);
      return error.response.data;
    } else {
      console.log(
        'axiosCrud.crear() - catch() - error: ' + JSON.stringify(error),
      );
      return {};
    }
  }
};

export const axiosCrearN = async (UrlApi, oEntidad) => {
  try {
    var auxEntidad = oEntidad;
    if (!oEntidad) {
      auxEntidad = {};
    }
    const response = await oAxios.post(UrlApi, auxEntidad);
    //const response = await oAxios.post(UrlApi, oEntidad);
    console.log('axiosCrearN - response: ', response.status);

    if (response && response.status && response.status == 204) {
      return true;
    }
    console.log(
      `axiosCrud.axiosCrearN() - ERROR - UrlApi: ${UrlApi} - oEntidad: ${oEntidad} - response.status !== 204 - response: ${JSON.stringify(
        response,
      )}`,
    );
    return false;
  } catch (error) {
    console.log('axiosCrud.axiosCrearN() - catch() - ');
    if (error && error.response && error.response.data) {
      return error.response.data;
    } else {
      console.log(
        'axiosCrud.axiosCrearN() - catch() - error: ' + JSON.stringify(error),
      );
      if (error && error.code && error.code == 'ECONNABORTED') {
        return error;
      }
    }
    return false;
  }
};



export const axiosActualizar = async (UrlApi, oEntidad, ID) => {
  let pkId = oEntidad.id;
  let URL = `${UrlApi}/${pkId}`;
  
  if (ID !== undefined && ID !== null) {
    pkId = ID;
    URL = `${UrlApi}/${ID}`;
  }
  
  //console.log(URL);
  try {
    delete oEntidad.id;
    const response = await oAxios.put(URL, oEntidad);
    oEntidad.id = pkId;
    if (
      response.status !== 204 &&
      response.status !== 200 &&
      response.status !== 201
    ) {
      //JsonServer devuelve 200
      console.log(
        `axiosCrud.actualizar() - ERROR 2 - UrlApi: ${UrlApi} - response.status !== 204 - response: ${JSON.stringify(
          response,
        )} `,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.log(
      `axiosCrud.actualizar() - UrlApi: ${UrlApi} - catch() - error`,
      error,
    );
    if (error && error.response && error.response.data) {
      return error.response.data;
    } else {
      console.log(
        'axiosCrud.actualizar() - catch() - error: ' + JSON.stringify(error),
      );
      return false;
    }
  }
};

export const axiosPatch = async (UrlApi, oEntidad) => {
  try {
    const response = await oAxios.patch(UrlApi, oEntidad);
    if (response.status === 200) {
      return true;
    } else {
      console.log(
        `axiosCrud.patch() - ERROR 2 - UrlApi: ${UrlApi} - response.status !== 200 - response: ${JSON.stringify(
          response,
        )} `,
      );
      return false;
    }
  } catch (error) {
    console.log(
      'axiosCrud.patch() - catch() - error: ' + JSON.stringify(error),
    );
    if (error && error.response && error.response.data) {
      return error.response.data;
    } else {
      console.log(
        'axiosCrud.patch() - catch() - error: ' + JSON.stringify(error),
      );
      return false;
    }
  }
};

export const axiosEliminar = async (UrlApi, id) => {
  const URL = `${UrlApi}/${id}`;
  try {
    const response = await oAxios.delete(URL);
    //console.log(response);
    if (response.status !== 204 && response.status !== 200) {
      //JsonServer devuelve 200
      console.log(
        `axiosCrud.eliminar() - ERROR 2 - UrlApi: ${UrlApi} - response: ${response}`,
      );
      return false;
    }
    return true;
  } catch (error) {
    console.log(`axiosCrud.eliminar() - UrlApi: ${UrlApi} - catch() - `);
    if (error && error.response && error.response.data) {
      return error.response.data;
    } else {
      console.log(
        'axiosCrud.eliminar() - catch() - error: ' + JSON.stringify(error),
      );
    }
    return false;
  }
};
