import React from 'react';
import {
  GridRowModes,
  GridToolbarContainer,
  GridToolbar,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

export default function EditarNuevaFilaParametros({
  setRows,
  rows,
  setRowModesModel,
  volverPrimerPagina,
  showQuickFilter,
  themeWithLocale,
  gridApiRef,
}) {
  const handleClearFilters = () => {
    if (gridApiRef?.current?.setFilterModel) {
      gridApiRef.current.setFilterModel({ items: [] });
    }
  };

  const handleClick = () => {
    handleClearFilters();

    // Evitar crear 2 filas temporales a la vez
    const yaHayTemp = rows?.some(r => String(r?.id || '').startsWith('temp-'));
    if (yaHayTemp) return;

    // 1) crear id temporal
    const tempId = `temp-${Date.now()}`;

    // 2) crear fila con ese id
    const newReg = {
      id: tempId,        // ← IMPORTANTE
      isNew: true,
      cuit: '',
      antiguedad: 0,
      cuotas: 0,
      diasIntencion: 0,
      ventanilla: false,
      redlink: false,
      banelco: false,
      cheque: false,
      tasa: '',
      vigDesde: null,
      vigHasta: null,
    };

    // 3) insertar y volver a la primera página
    volverPrimerPagina?.();
    setRows(prev => [newReg, ...(prev || [])]);

    // 4) poner ESA fila en edición usando su id (NO 0)
    setRowModesModel(prev => ({
      ...prev,
      [tempId]: { mode: GridRowModes.Edit },
    }));
  };

  return (
    <GridToolbarContainer theme={themeWithLocale} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Registro
      </Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
}