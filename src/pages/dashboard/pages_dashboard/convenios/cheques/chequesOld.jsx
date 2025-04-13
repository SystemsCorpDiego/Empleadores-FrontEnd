import React, { useContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import {
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  useGridApiRef,
} from '@mui/x-data-grid';
import {
  Modal,
  Box,
  TextField,
  IconButton,
  Button,
  //ThemeProvider,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StripedDataGrid, { dataGridStyle } from '@/common/dataGridStyle';
import AddIcon from '@mui/icons-material/Add';

import { UserContext } from '@/context/userContext';
import { axiosCheques } from './chequesApi';




const columnas = [
  { field: 'numero', headerName: 'Número de Cheque', width: 200 },
  { field: 'monto', headerName: 'Monto', width: 200 },
  { field: 'cuota', headerName: 'Cuota', width: 200 },
];

const crearNuevoRegistro = (props) => {
  const {
    setRows,
    rows,
    setRowModesModel,
    volverPrimerPagina,
    showQuickFilter,
    themeWithLocale,
    gridApiRef,

  } = props;

const altaHandleClick = () => {
  const ids = rows.map((row) => row.id);
  let newId;
  do {
    newId = Math.floor(Math.random() * 1000000);
  } while (ids.includes(newId));

  const newReg = {
    numero: '',
    monto: 0,
    cuota: 0,
    id: newId,
  };

  setRows((oldRows) => [newReg, ...oldRows]);
  setRowModesModel((oldModel) => ({
    ...oldModel,
    [newId]: { mode: GridRowModes.Edit },
  }));
  //volverPrimerPagina();
};
  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={altaHandleClick}
      >
        Nuevo Registro
      </Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
};

const Cheques = ({ open, handleClose, convenio, cuota, total }) => {
  //console.log(total);
  const [resta, setResta] = useState(total);
  const gridApiRef = useGridApiRef();
  const [locale, setLocale] = useState('esES');
  const [cheques, setCheques] = useState([]);
    
  const [rows, setRows] = useState([]);
  const theme = useTheme();
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const [rowModesModel, setRowModesModel] = useState({});
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  //console.log(resta);
/**
  useEffect(async () => {
    const arregloCheques = await axiosCheques.consultar(convenio, cuota);
    setCheques(arregloCheques);
    setRows(arregloCheques);
  }, []);
 */

  //const agregarFila = () => {
  //  setCheques([...cheques, { id: cheques.length + 12, numero: '', monto: '', cuota: '' }]);
  //};

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };
  const handleClearFilters = (apiRef) => {
    apiRef.current.setFilterModel({ items: [] });
  };

  const handleChange = (index, field, value) => {
    const nuevosCheques = [...cheques];
    nuevosCheques[index][field] = value;
    setCheques(nuevosCheques);
  };

  const hadleSave = () => {
    console.log(cheques);
    handleClose();
  };
  useEffect(() => setResta(total), []);

  useEffect(() => {
    const sumatoriaMontosCheques = cheques.reduce(
      (acc, item) => acc + Number(item.monto || 0),
      0,
    );
    setResta(total - sumatoriaMontosCheques);
  }, [cheques, total]); // Ahora `resta` se actualiza correctamente cuando `total` cambia

  //let total = cheques.map(cheque => resta)

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <h2>Ingresar Cheques</h2>
        <Box
          sx={{
            height: '25em',
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          {/*<LinearDeterminate progress={progress} isProcessing={isProcessing} />*/}
          <ThemeProvider theme={themeWithLocale}>
            <StripedDataGrid
              apiRef={gridApiRef}
              rows={cheques}
              columns={columnas}
              getRowId={(row) => row.id}
              getRowClassName={(params) =>
                rows.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
              }
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={(updatedRow, originalRow) =>
                processRowUpdate(updatedRow, originalRow)
              }
              localeText={dataGridStyle.toolbarText}
              slots={{ toolbar: crearNuevoRegistro }}
              slotProps={{
                toolbar: {
                  setRows,
                  rows,
                  setRowModesModel,
                  volverPrimerPagina,
                  showQuickFilter: true,
                  showColumnMenu: true,
                  themeWithLocale,
                  gridApiRef                  
                },
              }}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={pageSizeOptions}
            />
          </ThemeProvider>
        </Box>
        {/*cheques.map((cheque, index) => (
          <Box key={cheque.id} sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Número de Cheque"
              variant="outlined"
              fullWidth
              value={cheque.numero}
              onChange={(e) => handleChange(index, 'numero', e.target.value)}
            />
            <TextField
              label="Monto"
              variant="outlined"
              fullWidth
              type="number"
              value={cheque.monto}
              onChange={(e) => handleChange(index, 'monto', e.target.value)}
            />
          </Box>
        ))*/}

        {/** <IconButton onClick={agregarFila} color="primary">
          <AddCircleOutlineIcon />
        </IconButton>
        */}
        <h3>
          Resta $
          {resta.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h3>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={hadleSave}>
            Guardar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            sx={{ ml: 2 }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default Cheques;
