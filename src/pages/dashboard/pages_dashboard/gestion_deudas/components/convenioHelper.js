export const crearBodyConvenio = ({ ENTIDAD, cuotas, fechaIntencion, selectedActas, selectedDeclaracionesJuradas, selectedSaldosAFavor,medioPago }) => {
  console.log('medio de pago ', medioPago)
  return {
    entidad: ENTIDAD,
    cantidadCuota: cuotas,
    fechaPago: fechaIntencion ? fechaIntencion.format("YYYY-MM-DD") : null,
    actas: selectedActas,
    ddjjs: selectedDeclaracionesJuradas,
    ajustes: selectedSaldosAFavor,
    medioDePago: medioPago
  };
};
