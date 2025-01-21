import dayjs from 'dayjs';

const formatIntereses = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 6,
  useGrouping: true,
});

const formatCurrency = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
});

const interesesString = (value) => {
  try {
    if (value == 0) {
      return formatIntereses.format(0);
    }
    if (value && value !== '' && value !== null) {
      return formatIntereses.format(value);
    }
    return '';
  } catch (error) {
    console.log('currencyString - error: ', error);
    return '';
  }
};

const currencyString = (value) => {
  try {
    if (value == 0) {
      return formatCurrency.format(0);
    }
    if (value && value !== '' && value !== null) {
      return formatCurrency.format(value);
    }
    return '';
  } catch (error) {
    console.log('currencyString - error: ', error);
    return '';
  }
};

const formatDate = (value) => {
  //castea "YYYY-MM-DD" => "DD/MM/YYYY"
  try {
    let strFecha = '';
    if (value) {
      strFecha = new dayjs(value).format('DD/MM/YYYY');
    }
    return strFecha;
  } catch (error) {
    console.log('formatDate - error: ', error);
    return '';
  }
};

const dateObject = (strValue) => {
  //castea "YYYY-MM-DD" => Date object
  try {
    if (strValue && strValue !== '' && strValue !== null)
      return new dayjs(strValue);
    return null;
  } catch (error) {
    console.log('castDateString - error:', error);
    return null;
  }
};

const toBackendStr = (strValue) => {
  //castea "YYYY-MM-DD" => Date object
  try {
    if (strValue) {
      if (dayjs.isDayjs(strValue)) return strValue.format('YYYY-MM-DD');

      return new dayjs(strValue).format('YYYY-MM-DD');
    }
    return null;
  } catch (error) {
    console.log('castDateString - error:', error);
    return null;
  }
};

const dateString = (strValue) => {
  //castea "YYYY-MM-DD" => "DD/MM/YYYY"
  try {
    if (strValue) {
      if (dayjs.isDayjs(strValue)) return strValue.format('DD/MM/YYYY');

      return new dayjs(strValue).format('DD/MM/YYYY');
    }
    return null;
  } catch (error) {
    console.log('castDateString - error:', error);
    return null;
  }
};

const periodoString = (strValue) => {
  //castea "YYYY-MM-DD" => "MM/YYYY"
  try {
    if (strValue) {
      return new dayjs(strValue).format('MM/YYYY');
    }
    return '';
  } catch (error) {
    console.log('periodoStr - error:', error);
    return '';
  }
};

const periodoISOString = (strValue) => {
  //castea "YYYY-MM-DD" => "YYYY-MM"
  try {
    if (strValue) {
      return new dayjs(strValue).format('YYYY-MM');
    }
    return '';
  } catch (error) {
    console.log('periodoStr - error:', error);
    return '';
  }
};

const formatPeriodo = (value, separador) => {
  try {
    if (!separador) {
      separador = '/';
    }
    const date = new Date(value);
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}${separador}${year}`;
  } catch (error) {
    return '';
  }
};

const getPeriodoActual = () => {
  const ahora = dayjs().startOf('month');
  const ahoraMenosUnAnio = ahora.add(-1, 'month');
  return ahoraMenosUnAnio;
};

const formatFechaGrilla = (value) => {
  try {
    return new Date(value).toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

const formatFechaImport = (fechaExcel) => {
  // xlsx
  if (typeof fechaExcel === 'number') {
    const horas = Math.floor((fechaExcel % 1) * 24);
    const minutos = Math.floor(((fechaExcel % 1) * 24 - horas) * 60);
    const fechaFinal = new Date(
      Date.UTC(0, 0, fechaExcel, horas - 17, minutos),
    );

    const fechaDaysJs = dayjs(fechaFinal)
      .set('hour', 3)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    return fechaDaysJs;
  }

  // cvs
  if (typeof fechaExcel === 'string') {
    const partes = fechaExcel?.split('/');
    const anio = partes[2]?.length === 2 ? '20' + partes[2] : partes[2];
    const mes = partes[1].padStart(2, '0');
    const dia = partes[0];

    const fechaDaysJs = dayjs(`${anio}-${mes}-${dia}`)
      .set('hour', 3)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    return fechaDaysJs;
  }
};

const sumaTresHoras = (value) => {
  //const fecha = value;
  const fecha = new Date(value.toISOString().split('T')[0]);
  const nuevaFecha = new Date(fecha.getTime() + 3 * 60 * 60 * 1000);
  return nuevaFecha;
};

const esFechaValida = (fechaString) => {
  let fecha = new Date(fechaString);
  return !isNaN(fecha.getTime()) && fechaString === fecha.toISOString();
};

const toFechaValida = (value) => {
  if (value) {
    if (esFechaValida(value)) {
      return sumaTresHoras(new Date(value)).toISOString();
    } else if (value.length === 10) {
      return sumaTresHoras(new Date(value)).toISOString();
    } else {
      return sumaTresHoras(new Date(`${value}-01`)).toISOString();
    }
  }
  return undefined;
};

const formatter = {
  currency: formatCurrency,
  currencyString: currencyString,
  intereses: formatIntereses,
  interesesString: interesesString,
  dateObject: dateObject,
  dateString: dateString,
  dateToStringBackend: toBackendStr,
  periodoString: periodoString,
  periodoISOString: periodoISOString,
  getPeriodoActual: getPeriodoActual,

  date: formatDate,
  periodo: formatPeriodo,
  fechaGrilla: formatFechaGrilla,
  fechaImport: formatFechaImport,
  toFechaValida,
};

export default formatter;
