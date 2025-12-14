const crearBodyConvenio = ({
  ENTIDAD,
  cuotas,
  fechaIntencion,
  selectedActas,
  selectedDeclaracionesJuradas,
  selectedSaldosAFavor,
  medioPago,
}) => {
  console.log('medio de pago ', medioPago);
  return {
    entidad: ENTIDAD,
    cantidadCuota: cuotas,
    fechaPago: fechaIntencion ? fechaIntencion.format('YYYY-MM-DD') : null,
    actas: selectedActas,
    ddjjs: selectedDeclaracionesJuradas,
    ajustes: selectedSaldosAFavor,
    medioDePago: medioPago,
  };
};

const isEditarVer = () => {
  const auxIsEditar = isEditar();
  const auxIsVer = isVer();

  if (auxIsEditar || auxIsVer) return true;
  return false;
};

const isEditar = () => {
  return window.location.hash.includes('/editar');
};
const isVer = () => {
  return window.location.hash.includes('/ver');
};

const conveniosHelper = {
  isEditarVer: isEditarVer,
  isEditar: isEditar,
  isVer: isVer,
  crearBodyConvenio: crearBodyConvenio,
};

export default conveniosHelper;
