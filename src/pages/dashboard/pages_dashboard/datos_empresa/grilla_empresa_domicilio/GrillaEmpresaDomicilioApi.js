import { axiosEntity } from '@/components/axios/EntityCrud';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;

const adaptadorCrearDomicilio = async (domicilio) => {
  try {
    const provincias = await obtenerProvincias();
    const provincia = provincias.find(
      (element) => element.descripcion == domicilio.provincia,
    );
    const localidades = await obtenerLocalidades(provincia.id);
    const localidad = localidades.find(
      (element) => element.descripcion == domicilio.localidad,
    );
    domicilio.provinciaId = provincia.id;
    domicilio.localidadId = localidad.id;
    delete domicilio.provincia;
    delete domicilio.localidad;
    delete domicilio.isNew;
    return domicilio;
  } catch (error) {
    swal.showError(HTTP_MSG_ALTA_ERROR);
    return error;
  }
};

export const adaptadorDomicilioGrilla = async (domicilio) => {
  try {
    const provincias = await obtenerProvincias();
    const provincia = provincias.find(
      (element) => element.id == domicilio.provinciaId,
    );
    const localidades = await obtenerLocalidades(provincia.id);
    const localidad = localidades.find(
      (element) => element.id == domicilio.localidadId,
    );
    domicilio.provincia = provincia;
    domicilio.localidad = localidad;
    delete domicilio.provinciaId;
    delete domicilio.localidadId;
    delete domicilio.isNew;
    return domicilio;
  } catch (error) {
    swal.showError(HTTP_MSG_ALTA_ERROR);
    return error;
  }
};

export const adaptadorRegistroCompanyGrilla = async (domicilio) => {
  try {
    if (domicilio && domicilio.provincia) {
      const provincias = await obtenerProvincias();
      const provincia = provincias.find(
        (element) => element.descripcion == domicilio.provincia,
      );
      console.log(domicilio.localidad);
      const localidades = await obtenerLocalidades(provincia.id);
      console.log(localidades);
      const localidad = localidades.find(
        (element) => element.descripcion == domicilio.localidad,
      );
      console.log(localidad);

      domicilio.provincia = provincia;
      domicilio.localidad = localidad;
      delete domicilio.provinciaId;
      delete domicilio.localidadId;
      //delete domicilio.isNew;
      console.log(domicilio);
    }
    return domicilio;
  } catch (error) {
    swal.showError(HTTP_MSG_ALTA_ERROR);
    return error;
  }
};

export const obtenerTipoDomicilio = async () => {
  //const URL = '/empresa/domicilio/tipo';
  const URL = '/empresa/public/domicilio/tipo';
  return await axiosEntity.consultar(URL);
};

export const obtenerProvincias = async () => {
  //const URL = '/provincia';
  const URL = '/public/provincia';
  return await axiosEntity.consultar(URL);
};

export const obtenerLocalidades = async (idProvincia) => {
  //const URL = `/provincia/${idProvincia}/localidad`;
  const URL = `/public/provincia/${idProvincia}/localidad`;
  return await axiosEntity.consultar(URL);
};

export const obtenerDomicilios = async (empresaId) => {
  const URL = `/empresa/${empresaId}/domicilio`;
  return await axiosEntity.consultar(URL);
};

export const crearDomicilio = async (empresaId, domicilio) => {
  const URL = `/empresa/${empresaId}/domicilio`;
  const domiAdapt = await adaptadorCrearDomicilio(domicilio);
  return await axiosEntity.crear(URL, domiAdapt);
};

export const actualizarDomicilio = async (empresaId, domicilio) => {
  const URL = `/empresa/${empresaId}/domicilio`;
  const domiAdapt = await adaptadorCrearDomicilio(domicilio);
  return await axiosEntity.actualizar(URL, domiAdapt);
};

export const eliminarDomicilio = async (empresaId, idDomicilio) => {
  const URL = `/empresa/${empresaId}/domicilio`;
  return await axiosEntity.eliminar(URL, idDomicilio);
};

export const axiosDomicilio = {
  obtenerTipo: async function () {
    return obtenerTipoDomicilio();
  },

  obtenerProvincias: async function () {
    return obtenerProvincias();
  },

  obtenerLocalidades: async function (provinciaId) {
    return obtenerLocalidades(provinciaId);
  },

  obtenerDomicilios: async function (empresaId) {
    return obtenerDomicilios(empresaId);
  },

  crear: async function (idEmpresa, registro) {
    return crearDomicilio(idEmpresa, registro);
  },

  actualizar: async function (idEmpresa, registro) {
    return actualizarDomicilio(idEmpresa, registro);
  },

  eliminar: async function (idEmpresa, idContacto) {
    return eliminarDomicilio(idEmpresa, idContacto);
  },
};
