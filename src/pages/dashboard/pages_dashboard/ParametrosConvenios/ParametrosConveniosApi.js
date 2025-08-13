// ParametrosConveniosApi.jsx
import { axiosCrud } from '@components/axios/axiosCrud';
import formatter from '@/common/formatter';
import swal from '@/components/swal/swal';

const HTTP_MSG_ALTA       = import.meta.env.VITE_HTTP_MSG_ALTA;
const HTTP_MSG_MODI       = import.meta.env.VITE_HTTP_MSG_MODI;
const HTTP_MSG_BAJA       = import.meta.env.VITE_HTTP_MSG_BAJA;
const HTTP_MSG_ALTA_ERROR = import.meta.env.VITE_HTTP_MSG_ALTA_ERROR;
const HTTP_MSG_MODI_ERROR = import.meta.env.VITE_HTTP_MSG_MODI_ERROR;
const HTTP_MSG_BAJA_ERROR = import.meta.env.VITE_HTTP_MSG_BAJA_ERROR;
const HTTP_MSG_CONSUL_ERROR = import.meta.env.VITE_HTTP_MSG_CONSUL_ERROR;

// Ajustá el recurso según tu backend si difiere
const URL_ENTITY = '/convenio-seteo';

// ---------- Normalizadores ----------

// Convierte valores "de UI" a "de API"
const normalizeOut = (registro) => {
  const out = { ...registro };

  // strings vacíos -> null
  const toNullIfEmpty = (v) => (v === '' ? null : v);

  out.cuit           = toNullIfEmpty(out.cuit);
  out.tasa           = toNullIfEmpty(out.tasa);

  // numéricos
  const toNumberOrNull = (v) => {
    if (v === '' || v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  out.antiguedad     = toNumberOrNull(out.antiguedad);
  out.cuotas         = toNumberOrNull(out.cuotas);
  out.diasIntencion  = toNumberOrNull(out.diasIntencion);

  // booleanos (ya vienen bien del checkbox, pero por las dudas)
  const toBool = (v) => v === true;
  out.ventanilla = toBool(out.ventanilla);
  out.redlink    = toBool(out.redlink);
  out.banelco    = toBool(out.banelco);
  out.cheque     = toBool(out.cheque);

  // fechas (permitimos null o string yyyy-MM-dd)
  const toApiDate = (v) => {
    if (!v) return null;
    // si viene Date o string yyyy-MM-dd las dejamos como yyyy-MM-dd
    try {
      const d = (v instanceof Date) ? v : new Date(v);
      if (Number.isNaN(d.getTime())) return null;
      return d.toISOString().substring(0, 10);
    } catch {
      return null;
    }
  };
  out.tasa = Number(out.tasa)

  out.vigDesde = toApiDate(out.vigDesde);
  out.vigHasta = toApiDate(out.vigHasta);

  // Si tu backend espera otros campos con formato especial, hacelo acá:
  // out.vigencia = formatter.toFechaValida(out.vigencia) // ejemplo

  return out;
};

// Convierte valores "de API" a "de UI / Grid"
const normalizeIn = (registro) => {
  const r = { ...registro };

  // Fechas a Date (para type: 'date'), si preferís string yyyy-MM-dd, cambia acá y en valueGetter
  const toDateOrNull = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  r.vigDesde = toDateOrNull(r.vigDesde);
  r.vigHasta = toDateOrNull(r.vigHasta);

  // Booleans por si vinieran null
  r.ventanilla = !!r.ventanilla;
  r.redlink    = !!r.redlink;
  r.banelco    = !!r.banelco;
  r.cheque     = !!r.cheque;

  // Números por si vinieran string
  const toNum = (v) => (v == null || v === '' ? 0 : Number(v));
  r.antiguedad    = Number.isNaN(Number(r.antiguedad)) ? 0 : toNum(r.antiguedad);
  r.cuotas        = Number.isNaN(Number(r.cuotas)) ? 0 : toNum(r.cuotas);
  r.diasIntencion = Number.isNaN(Number(r.diasIntencion)) ? 0 : toNum(r.diasIntencion);

  // Strings por si vienen null
  r.cuit = r.cuit ?? '';
  r.tasa = r.tasa ?? '';

  return r;
};

// ---------- API ----------

export const axiosParametrosConvenios = {
  consultar: async function () {
    return consultar();
  },
  crear: async function (oEntidad) {
    return crear(oEntidad);
  },
  actualizar: async function (oEntidad) {
    return actualizar(oEntidad);
  },
  eliminar: async function (id) {
    return eliminar(id);
  },
};

export const consultar = async () => {
  try {
    const data = await axiosCrud.consultar(`${URL_ENTITY}`);
    const rows = Array.isArray(data) ? data : [];
    return rows.map(normalizeIn);
  } catch (error) {
    swal.showErrorBackEnd(
      HTTP_MSG_CONSUL_ERROR + ` (${URL_ENTITY} - status: ${error?.status})`,
      error,
    );
    return [];
  }
};

export const crear = async (registro) => {
  //const payload = normalizeOut(registro);
  const { id, isNew, ...payload } = normalizeOut(registro);
  try {
    const data = await axiosCrud.crear(`${URL_ENTITY}`, payload);
    if (data && data.id) {
      swal.showSuccess(HTTP_MSG_ALTA);
      // devolver normalizado para el grid
      return normalizeIn(data);
    }
    throw data;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_ALTA_ERROR, error);
    return {};
  }
};

export const actualizar = async (registro) => {
  const payload = normalizeOut(registro);
  try {
    const ok = await axiosCrud.actualizar(`${URL_ENTITY}`, payload);
    if (ok === true) {
      swal.showSuccess(HTTP_MSG_MODI);
      return true;
    }
    throw ok;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_MODI_ERROR, error);
    return false;
  }
};

export const eliminar = async (id) => {
  try {
    const ok = await axiosCrud.eliminar(`${URL_ENTITY}`, id);
    if (ok === true) {
      swal.showSuccess(HTTP_MSG_BAJA);
      return true;
    }
    throw ok;
  } catch (error) {
    swal.showErrorBackEnd(HTTP_MSG_BAJA_ERROR, error);
    return false;
  }
};