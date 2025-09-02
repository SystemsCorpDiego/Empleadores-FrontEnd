
import moment from 'moment';
import Swal from 'sweetalert2';

export const fetchEmpresaData = async (
  editar,
  isVer,
  empresa,
  ID_EMPRESA,
  ENTIDAD,
  axiosGestionDeudas,
  setDetalleConvenio,
  setFechaIntencion,
  setIntereses,
  setImporteDeDeuda,
  setSaldosAFavor,
  setCuotas,
  setDeclaracionesJuradas,
  setActas,
  setConvenios,
  setSelectedActas,
  setSelectedDeclaracionesJuradas,
  setSelectedSaldosAFavor,
  setTotalDeuda,
  setLoadAllEmpresas,
  setMedioPago,
  rol
) => {
  setLoadAllEmpresas(true);

  try {
    let response;
    if (!editar && !isVer) {
      empresa = empresa || ID_EMPRESA;

      console.log('fetchEmpresaData - empresa:', empresa);
      response = await axiosGestionDeudas.getDeclaracionesJuradas(
        empresa,
        ENTIDAD,
      );

    } else {
      const parts = window.location.hash.split('/');
      const CONVENIOID = parts[parts.indexOf('convenio') + 1];
      response = await axiosGestionDeudas.getDeclaracionesJuradasEditar(
        empresa ? empresa : ID_EMPRESA,
        CONVENIOID
      );
      if (response.lstCuotas) {
        setDetalleConvenio(response.lstCuotas);
      }
    }
    if (response === null || response === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontraron datos para la empresa seleccionada.',
        confirmButtonText: 'Aceptar',
      });
    }
    if (response === null || response === undefined) {
      setLoadAllEmpresas(false);
      return;
    }
    if (response.intencionPago && response.intencionPago !== null && response.intencionPago !== undefined) {
      setFechaIntencion(response.intencionPago ? moment(response.intencionPago) : null);
    }
    if (response.interes) {
      setIntereses(response.interes);
    }
    if (response.deuda) {
      setImporteDeDeuda(response.deuda);
    }
    if (response.saldoAFavor) {
      setSaldosAFavor(response.saldoAFavor);
    }
    if (response.cuotas) {
      setCuotas(response.cuotas);
    } else {
      setCuotas(1);
    }

    setDeclaracionesJuradas(response['declaracionesJuradas']);
    setActas(response['actas']);
    setConvenios(response['convenios']);
    setSaldosAFavor(response['saldosAFavor'])
    const idsActas = response['actas'].map((objeto) => objeto.id);
    setSelectedActas(idsActas);
    if (editar) {
      const preselectedActas = response['actas']
        .filter((item) => item.convenioActaId !== null)
        .map((item) => item.id);
      setSelectedActas(preselectedActas);

      const preselected = response['declaracionesJuradas']
        .filter((item) => item.convenioDdjjId !== null && item.convenioDdjjId !== undefined)
        .map((item) => item.id);

      setSelectedDeclaracionesJuradas((prev) => {
        if (preselected.length > 0 && preselected.some(id => !prev.includes(id))) {
          return Array.from(new Set([...prev, ...preselected]));
        }
        return prev;
      });

      const preselectedAjustes = response['saldosAFavor']
        .filter((item) => item.convenioAjusteId !== null && item.convenioAjusteId !== undefined)
        .map((item) => item.id);

      setSelectedSaldosAFavor((prev) => {
        if (preselectedAjustes.length > 0 && preselectedAjustes.some(id => !prev.includes(id))) {
          return Array.from(new Set([...prev, ...preselectedAjustes]));
        }
        return prev;
      });
    } else {
      const idsdeclaracionesJuradas = response['declaracionesJuradas'].map((objeto) => objeto.id);
      setSelectedDeclaracionesJuradas(idsdeclaracionesJuradas);
      const idSelectedSaldosAFavor = response['saldosAFavor'].map((objeto) => objeto.id);
      setSelectedSaldosAFavor(idSelectedSaldosAFavor);
    }
    setMedioPago(response.medioPago || null);

    const totalDeudaCalculada =
      response['declaracionesJuradas'].reduce((acc, dj) => acc + (dj.importeTotal || 0), 0) +
      response['actas'].reduce((acc, acta) => acc + (acta.importeTotal || 0), 0);
    setTotalDeuda(totalDeudaCalculada);
    setLoadAllEmpresas(false);
  } catch (error) {
    console.error('Error al obtener las declaracionesJuradas: ', error);
    setLoadAllEmpresas(false);
  }
};

export const buscarEmpresaPorCuit = async ({
  valor,
  empresas,
  axiosGestionDeudas,
  setEmpresaId,
  setNombreEmpresa,
  fetchData
}) => {
  const empresaID = await axiosGestionDeudas.getEmpresaByCuit(valor, empresas);
  if (empresaID === null) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se encontró la empresa con el CUIT proporcionado.',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  const empresa = empresas.find(e => e.cuit === valor);
  console.log('Empresa encontrada:', empresa);
  setNombreEmpresa(empresa?.razonSocial);
  setEmpresaId(empresaID);
  fetchData(false, empresaID);
};

export const buscarEmpresaPorNombre = async ({
  valor,
  empresas,
  axiosGestionDeudas,
  setEmpresaId,
  setCuitInput,
  fetchData
}) => {
  const empresaID = await axiosGestionDeudas.getEmpresaByNombre(valor, empresas);
  if (empresaID === null) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se encontró la empresa con el nombre proporcionado.',
      confirmButtonText: 'Aceptar',
    });
    return;
  }

  const empresa = empresas.find(e => e.razonSocial === valor);
  setCuitInput(empresa?.cuit);
  setEmpresaId(empresaID);
  fetchData(false, empresaID);
};
// Crear convenio
export const generarConvenio = async (ID_EMPRESA, bodyConvenio, axiosGestionDeudas, swal, setShowLoading) => {
  try {

    console.log('Generando convenio con los siguientes datos:', bodyConvenio);
    console.log('ID_EMPRESA:', ID_EMPRESA);
    const response = await axiosGestionDeudas.generarConvenio(ID_EMPRESA, bodyConvenio);
    console.log('Respuesta del servidor:', response);
    setShowLoading(false);
    if (response === true) {
      await swal.fire({
        icon: 'success',
        title: 'Convenio generado correctamente',
        confirmButtonText: 'Aceptar'
      });
      return true;
    } else {
      await swal.fire({
        icon: 'error',
        title: 'Error',
        text: (response && response.descripcion) ? response.descripcion : 'No se pudo generar el convenio.',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }
  } catch (error) {
    setShowLoading(false);
    console.error('Error al generar convenio:', error?.response || error);
    await swal.fire({
      icon: 'error',
      title: 'Error',
      text: error?.response?.data?.message || error.message || 'Ocurrió un error al generar el convenio.',
      confirmButtonText: 'Aceptar'
    });
    return false;
  }
};


export const actualizarConvenio = async (ID_EMPRESA, convenioId, bodyConvenio, axiosGestionDeudas, swal) => {
  console.log('Actualizando convenio con los siguientes datos:', bodyConvenio);
  const camposNulos = Object.entries(bodyConvenio)
    .filter(([clave, valor]) => valor === null)
    .map(([clave]) => clave);
  if (camposNulos.length > 0) {
    await swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Por favor, complete todos los campos requeridos: ${camposNulos.join(', ')}`,
      confirmButtonText: 'Aceptar',
    });
    return false;
  }
  try {
    const response = await axiosGestionDeudas.putActualizarConvenio(ID_EMPRESA, convenioId, bodyConvenio);

    await swal.fire({
      icon: 'success',
      title: 'Convenio actualizado correctamente',
      confirmButtonText: 'Aceptar'
    });
    return true;
  } catch (error) {
    /*
        await swal.fire({
          icon: 'error',
          title: 'Error',
          text: error?.response?.data?.message || error.message || 'Ocurrió un error al actualizar el convenio.',
          confirmButtonText: 'Aceptar'
        });
        */
    return false;
  }
};