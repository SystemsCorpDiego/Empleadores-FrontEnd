import { axiosDDJJ } from './DDJJApi';
import { DDJJMapper } from './DDJJMapper';

//rowsValidaciones, setRowsValidaciones;
//const [rowsValidaciones, setRowsValidaciones] = useState([]); //Usado para "Pintar" errores en la grilla.-

const addValidaciones = (cuil, errores) => {
  if (!errores || !errores.push) {
    console.log('addValidaciones - FALSE - errores:', errores);
    return false;
  }

  let newRowsValidaciones = { ...useGridValidaciones.getRowsValidaciones() };
  if (!newRowsValidaciones.errores || !newRowsValidaciones.errores.push) {
    console.log(
      'addValidaciones - HAGO new [] - newRowsValidaciones.errores:',
      newRowsValidaciones.errores,
    );
    newRowsValidaciones.errores = [];
  } else {
    newRowsValidaciones = useGridValidaciones.remove(cuil, newRowsValidaciones);
  }

  //console.log('newRowsValidaciones: ', newRowsValidaciones);
  errores.map((item) => {
    newRowsValidaciones.errores.push(item);
  });
  //console.log('newRowsValidaciones: ', rowsValidaciones);

  return newRowsValidaciones;
};

const deleteValidacionesCuil = (cuil) => {
  console.log('deleteValidacionesCuil - cuil', cuil);
  console.log(
    'useGridValidaciones.getRowsValidaciones',
    useGridValidaciones.getRowsValidaciones(),
  );

  //Si mando Vector , lo usa, sino lo toma del estado.-
  const newRowsValidaciones = {
    ...useGridValidaciones.getRowsValidaciones(),
  };
  console.log(
    'deleteValidacionesCuil - newRowsValidaciones1:',
    newRowsValidaciones,
  );
  if (newRowsValidaciones.errores && newRowsValidaciones.errores.filter) {
    newRowsValidaciones.errores = newRowsValidaciones.errores.filter((item) => {
      if (item.cuil != cuil) {
        console.log('filter - DIF - item:', item);
      } else {
        console.log('filter - IGUAL - item:', item);
      }
      return item.cuil != cuil;
    });
  }
  console.log(
    'deleteValidacionesCuil - newRowsValidaciones2:',
    newRowsValidaciones,
  );

  console.log(
    'deleteValidacionesCuil - Actualiza ESTADO - newRowsValidaciones:',
    newRowsValidaciones,
  );

  //useGridValidaciones.setRowsValidaciones(newRowsValidaciones);
  useGridValidaciones.setRowsValidaciones(newRowsValidaciones);

  return newRowsValidaciones;
};

const validarDDJJ = async (cabecera, rows) => {
  //1) Armar vector "RowsValidaciones" con los errores de CUIL y de Atributos del CUIL
  //y actualiza el useState.-

  console.log('validarDDJJ - rows:', rows);
  //console.log('validarDDJJ - typeof rows: ', typeof rows);
  const newRowsValidaciones = await getValidacionesBackend(cabecera, rows);
  //console.log('validarDDJJ - newRowsValidaciones: ', newRowsValidaciones);

  //Actualizo estado para "Pintar" la grilla donde hay error
  useGridValidaciones.setRowsValidaciones(newRowsValidaciones);
  return newRowsValidaciones;
};

const actualizarFiltroErrores = (rows, newRowsValidaciones) => {
  //Agrego Atributo "gErrores" para "Filtrado de Grilla"

  //console.log('actualizarFiltroErrores - rows: ', rows);
  //console.log( 'actualizarFiltroErrores - newRowsValidaciones: ', newRowsValidaciones, );
  const newRows = rows.slice();
  //console.log('actualizarFiltroErrores - newRows: ', newRows);
  //console.log('actualizarFiltroErrores - typeof newRows: ', typeof newRows);
  newRows?.map((regCuil) => {
    //console.log('validarDDJJGrillaErroresRefresh - updateRows - gridData.forEach - row:',row);
    regCuil.gErrores = false;
    newRowsValidaciones?.errores?.forEach((regVal) => {
      if (regVal.cuil == regCuil.cuil) {
        //pongo en true el row
        regCuil.gErrores = true;
      }
    });
  });
  //console.log('actualizarFiltroErrores - newRows: ', newRows);
  return newRows;
};

const getValidacionesBackend = async (cabecera, rows) => {
  const DDJJ = DDJJMapper.rowsToDDJJValDto(cabecera, rows);
  const newRowsValidaciones = await axiosDDJJ.validar(cabecera.empresaId, DDJJ); //errores de "Atributos del CUIL"
  const CuilesValidaciones = await validarDDJJCuiles(DDJJ); //errores de "CUIL"
  //Unifico Errores
  CuilesValidaciones.forEach((element) => {
    if (!element.cuilValido) {
      if (newRowsValidaciones && newRowsValidaciones.errores)
        newRowsValidaciones.errores.push({
          cuil: element.cuil.toString(),
          codigo: 'cuil',
          descripcion: 'CUIL INVALIDO',
          indice: null,
        });
    }
  });
  return newRowsValidaciones;
};

const validarDDJJCuiles = async (DDJJ) => {
  const cuiles = [];
  DDJJ.afiliados.map(function (item) {
    cuiles.push(item.cuil);
  });

  const cuilesString = cuiles.map((item) => item?.toString());
  const cuilesResponse = await axiosDDJJ.validarCuiles(
    DDJJ.empresaId,
    cuilesString,
  );

  return cuilesResponse;
};

const tieneErrores = () => {
  console.log('useGridValidaciones. - tieneErrores - INIT');
  console.log(
    'useGridValidaciones.getRowsValidaciones():',
    useGridValidaciones.getRowsValidaciones(),
  );
  if (
    useGridValidaciones.getRowsValidaciones &&
    useGridValidaciones.getRowsValidaciones().errores &&
    useGridValidaciones.getRowsValidaciones().errores.length > 0
  ) {
    console.log(
      'useGridValidaciones.getRowsValidaciones:',
      useGridValidaciones.getRowsValidaciones(),
    );
    return true;
  }
  return false;
};
export const useGridValidaciones = {
  getRowsValidaciones: null,
  setRowsValidaciones: null,
  add: addValidaciones,
  remove: deleteValidacionesCuil,
  validarDDJJ: validarDDJJ,
  actualizarFiltroErrores: actualizarFiltroErrores,
  tieneErrores: tieneErrores,
};
