import formatter from '@/common/formatter';

function getAporteDescrip(vecAportes, codigo) {
  if (vecAportes && vecAportes.find) {
    let reg = vecAportes.find((aporte) => aporte.codigo == codigo);
    console.log('getAporteDescrip - codigo: ', codigo);
    console.log('getAporteDescrip - reg: ', reg);

    if (!reg) {
      console.log('getAporteDescrip - DEVUELVO CODIGO. ');
      return codigo;
    }
    console.log('getAporteDescrip - DEVUELVO desccrip: ', reg.descripcion);
    return reg.descripcion;
  }
}

function getColsAporte(rowsMisDDJJ) {
  //INPUT:
  //    rows: recordset consulta "Mis DDJJ"
  //OUTPUT: vector con los diferentes "codigos de Aporte" de la consulta. Ej.: ['UOMACU', 'ART46', 'UOMASC']

  //console.log('misDDJJColumnaAporteGet - ddjjResponse:', rowsMisDDJJ);
  if (!rowsMisDDJJ || !rowsMisDDJJ.map) {
    return [];
  }

  let vecAportes = rowsMisDDJJ.map((item) => item.aportes).flat();
  //console.log('misDDJJColumnaAporteGet - vecAportes:', vecAportes);

  let colAportes = vecAportes.reduce((acc, item) => {
    if (!acc.includes(item.codigo)) {
      acc.push(item.codigo);
    }
    return acc;
  }, []);

  //console.log('misDDJJColumnaAporteGet - colAportes:', colAportes);
  return colAportes;
}

function getVecRowAportesConTotales(ddjjRow, grillaColsAporte) {
  //Por cada Row de la consulta de "Mis DDJJ", armo vector de "Columnas Totales por Aportes"

  let vecRowAportes = ddjjRow.aportes;

  let vecRowAportesConTotales = [];
  grillaColsAporte.forEach((element) => {
    vecRowAportesConTotales.push({ codigo: element, importe: 0 });
  });

  vecRowAportes.forEach((aporte) => {
    vecRowAportesConTotales.forEach((total) => {
      if (total.codigo == aporte.codigo) {
        total.importe = total.importe + aporte.importe;
      }
    });
  });
  return vecRowAportesConTotales;
}

const addColumnsAportes = (rowsMisDDJJ, columns, vecAportes) => {
  //INPUT:
  //    rows: recordset con las DDJJ y un Array de los totales a pagar por Aporte
  //  columns: columnas de la grilla
  // vecAportes: vector de aportes (codigo,descrip) para el titulo de la columna
  //OUTPUT: agrega en "columns" las columnas "Aporte" de la DDJJ

  console.log('addColumnsAportes - vecAportes:', vecAportes);

  let colAportes = getColsAporte(rowsMisDDJJ);
  //console.log('MisDDJJGrilla - 1 - misDDJJColumnaAporteGet - colAportes:', colAportes,);

  if (colAportes && vecAportes.filter) {
    const intersection = vecAportes.filter((reg) =>
      colAportes.includes(reg.codigo),
    );
    colAportes = intersection.map((reg) => reg.codigo);
  }

  //Agrego Columna a la grilla.-
  colAportes.forEach((elem) => {
    columns.push({
      field: 'total' + elem,
      headerName: getAporteDescrip(vecAportes, elem),
      flex: 1,
      editable: false,
      headerAlign: 'center',
      //align: 'center',
      align: 'right',
      headerClassName: 'header--cell',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    });
  });

  console.log('addColumnsAportes - return columns:', columns);

  return columns;
};

const castRows = (rowsMisDDJJ) => {
  //console.log('castRows - rows:', rowsMisDDJJ);

  if (!rowsMisDDJJ || !rowsMisDDJJ.length) {
    console.log('castRows - DEVUKELVE [] !!!');
    return [];
  }

  let colAportes = getColsAporte(rowsMisDDJJ);
  //console.log('castRows - colAportes:', colAportes);
  rowsMisDDJJ.forEach((rowMisDDJJ) => {
    let vecRowColsAportesConTotales = getVecRowAportesConTotales(
      rowMisDDJJ,
      colAportes,
    );

    //Agrega como propiedades del row, los totales de cada Aporte.-
    vecRowColsAportesConTotales.forEach((regTot) => {
      rowMisDDJJ['total' + regTot.codigo] = regTot.importe;
    });
  });
  //console.log('castRows - FIN - rows:', rowsMisDDJJ);
  return rowsMisDDJJ;
};

export const DDJJCrossTbl = {
  addColAportes: addColumnsAportes,
  castRows,
};
