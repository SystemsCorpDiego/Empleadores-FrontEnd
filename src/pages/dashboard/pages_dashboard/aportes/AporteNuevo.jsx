import {
  GridRowModes,
  GridToolbarContainer,
  GridToolbar,
} from '@mui/x-data-grid';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

export const EditarNuevaFila = (props) => {
  const {
    setRows,
    rows,
    setRowModesModel,
    volverPrimerPagina,
    showQuickFilter,
    showColumnMenu,
    themeWithLocale,
    gridApiRef,
    isEditing,
    setIsEditing
  } = props;
  console.log(gridApiRef)

  const handleClearFilters = () => {
    gridApiRef.current.setFilterModel({ items: [] });
  };

  const handleClick = () => {
    handleClearFilters()
    if (rows) {
      const editRow = rows.find((row) => !row.id);
      console.log(editRow)
      const alreadyEditing = rows.some((row) => String(row.id).startsWith('temp-'));
      if (!alreadyEditing && !isEditing) {
        const tempId = `temp-${Date.now()}`;
        console.log(tempId)
        const newReg = {
          'id': tempId,
          //'id': rows.length + 1,
          'entidad': '',
          'aporte': '',
          'socio': '',
          'calculoTipo': '',
          'calculoValor': 0,
          'calculoBase': '',
          'camara': '',
          'camaraCategoria': '',
          'desde': '',
          'hasta': '',
          'camaraAntiguedad': null
        };

        console.log(newReg)
        volverPrimerPagina();
        setRows((oldRows) => [newReg, ...oldRows]);
        setRowModesModel((oldModel) => ({
          ...oldModel,
          [tempId]: { mode: GridRowModes.Edit, fieldToFocus: 'entidad' },
        }));
        setIsEditing(true);
      } else {
        console.warn('Ya hay un registro en edición. Guarda o cancela antes de crear uno nuevo.')
      }


      //if (typeof editRow === 'undefined' || editRow.id) {

      // }
    }
  };

  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Nuevo Registro
      </Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
};
