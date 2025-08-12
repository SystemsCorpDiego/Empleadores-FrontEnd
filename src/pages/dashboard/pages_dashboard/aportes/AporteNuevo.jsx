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
      gridApiRef
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
        if (typeof editRow === 'undefined' || editRow.id) {
          const newReg = {
            //'id':0,
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
            'camaraAntiguedad':0
          };

          //const newReg = {
          //  //id:Date.now(),
          //  'id': Date.now(),
          //  'entidad': '',
          //  'aporte': '',
          //  'socio': '',
          //  'calculoTipo': '',ß
          //  'calculoValor': '',
          //  'calculoBase': '',
          //  'camara': '',
          //  'camaraCategoria': '',
          //  'desde': '',
          //  'hasta': '',
          //  'camaraAntiguedad':''
          //};
  
          volverPrimerPagina();
          setRows((oldRows) => [newReg, ...oldRows]);
          setRowModesModel((oldModel) => ({
            [0]: { mode: GridRowModes.Edit },
            ...oldModel,
          }));
        }
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
  