import { axiosGestionDeudas } from '@/pages/dashboard/pages_dashboard/gestion_deudas/Entidades/GestionApi';

export const calcularDetalleConvenio = async ({
  declaracionesJuradas,
  selectedDeclaracionesJuradas,
  actas,
  selectedActas,
  saldosAFavor,
  selectedSaldosAFavor,
  cuotas,
  fechaIntencion,
  empresaId,
}) => {
  try {
    const sumaDeclaracionesJuradas = declaracionesJuradas
      .filter((dj) => selectedDeclaracionesJuradas.includes(dj.id))
      .reduce((acc, dj) => acc + (dj.importeTotal || 0), 0);

    const sumaActas = actas
      .filter((acta) => selectedActas.includes(acta.id))
      .reduce((acc, acta) => acc + (acta.importeTotal || 0), 0);

    const sumaSaldosAFavor = saldosAFavor
      .filter((saldo) => selectedSaldosAFavor.includes(saldo.id))
      .reduce((acc, saldo) => acc + (saldo.importe || 0), 0);

    const importeDeuda = sumaDeclaracionesJuradas + sumaActas;

    const body = {
      importeDeuda: importeDeuda - sumaSaldosAFavor,
      cantidadCuota: cuotas,
      fechaIntencionPago: fechaIntencion
        ? fechaIntencion.format('YYYY-MM-DD')
        : null,
    };

    const detalle = await axiosGestionDeudas.getDetalleConvenio(
      empresaId,
      body,
    );

    return { importeDeuda, detalle };
  } catch (error) {
    console.error('Error en calcularDetalleConvenio: ', error);
    return { importeDeuda: 0, detalle: {} };
  }
};

export const detalleHelper = {
  calcularDetalleConvenio: calcularDetalleConvenio,
};

export default detalleHelper;
