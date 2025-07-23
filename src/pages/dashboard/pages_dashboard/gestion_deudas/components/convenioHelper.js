export const crearBodyConvenio = ({ ENTIDAD, cuotas, fechaIntencion, selectedActas, selectedDeclaracionesJuradas, selectedSaldosAFavor }) => {
  return {
    entidad: ENTIDAD,
    cantidadCuota: cuotas,
    fechaPago: fechaIntencion ? fechaIntencion.format("YYYY-MM-DD") : null,
    actas: selectedActas,
    ddjjs: selectedDeclaracionesJuradas,
    ajustes: selectedSaldosAFavor,
  };
};
