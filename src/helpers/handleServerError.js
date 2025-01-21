export const handleServerError = (
  rowsAux,
  row,
  setRows,
  setRowModesModel,
  GridRowModes,
  isUpdate,
) => {
  if (isUpdate) {
    const newReg = {
      id: row.id,
      titulo: row.titulo,
      cuerpo: row.cuerpo,
      vigenciaDesde: row.vigenciaDesde,
      vigenciaHasta: row.vigenciaHasta,
    };

    const rowsNew = rowsAux.map((r) => (r.id === row.id ? newReg : r));
    setRows(rowsNew);
    setTimeout(() => {
      setRowModesModel((oldModel) => ({
        [rowsAux.indexOf(row)]: {
          mode: GridRowModes.Edit,
          fieldToFocus: 'name',
        },
        ...oldModel,
      }));
    }, 100);
  } else {
    setRows(rowsAux.filter((reg) => reg.id !== row.id));

    const newReg = {
      titulo: row.titulo,
      cuerpo: row.cuerpo,
      vigenciaDesde: row.vigenciaDesde,
      vigenciaHasta: row.vigenciaHasta,
    };

    setRows((oldRows) => [newReg, ...oldRows]);
    setTimeout(() => {
      setRowModesModel((oldModel) => ({
        [0]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        ...oldModel,
      }));
    }, 100);
  }
};
