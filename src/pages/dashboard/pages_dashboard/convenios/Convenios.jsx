import * as locales from '@mui/material/locale';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  createTheme,
} from '@mui/material';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import './Convenios.css';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { UserContext } from '@/context/userContext';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo para el DataGrid
const conveniosData = [
  {
    id: 1,
    fecha: 'MM/AAAA',
    numero: 1,
    deuda: '20.000,00',
    interes: '100,00',
    saldo: '20.100,00',
    total: '20.100,00',
    cuotas: 3,
    medioPago: 'Cheque',
    cheque: '',
    estado: 'Pendiente...',
  },
  {
    id: 2,
    fecha: 'MM/AAAA',
    numero: 2,
    deuda: '30.000,00',
    interes: '3.000,00',
    saldo: '33.000,00',
    total: '33.000,00',
    cuotas: 2,
    medioPago: 'Cheque',
    cheque: '123 / 567',
    estado: 'Cheque Recibido',
  },
  {
    id: 3,
    fecha: 'MM/AAAA',
    numero: 3,
    deuda: '120.000,00',
    interes: '20.000,00',
    saldo: '140.000,00',
    total: '140.000,00',
    cuotas: 1,
    medioPago: 'Cheque',
    cheque: '',
    estado: 'Cerrado',
  },
];

// Columnas del DataGrid


const crearNuevoRegistro = (props) => {
  const {
    setRows,
    rows,
    setRowModesModel,
    volverPrimerPagina,
    showQuickFilter,
    themeWithLocale,
  } = props;


  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >

      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
};

export const Convenios = () => {
  const [locale, setLocale] = useState('esES');
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const columnas = [
    { field: 'fecha', headerName: 'Fecha', width: 120 },
    { field: 'numero', headerName: 'N°', width: 40, align: 'right' },
    { field: 'deuda', headerName: 'Deuda Orig', width: 120, align: 'right'},
    { field: 'interes', headerName: 'Intereses Financ.', width: 120, align: 'right' },
    { field: 'saldo', headerName: 'Sdo a Favor utilizado', width: 120, align: 'right' },
    { field: 'total', headerName: 'Total Convenio', width: 150, align: 'right' },
    { field: 'cuotas', headerName: 'Cant. Cuotas', width: 80, align: 'right' },
    { field: 'medioPago', headerName: 'Medio Pago', width: 120 },
    { field: 'cheque', headerName: 'N° Cheque', width: 120 },
    { field: 'estado', headerName: 'Estado', width: 150 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      type:'actions',
      width: 150,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<DownloadIcon />}
          label="Download"
          sx={{ color: 'primary.main' }}
          onClick={() => console.log(row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          sx={{ color: 'primary.main' }}
          onClick={() => navigate(`/dashboard/gestiondeuda/${row.id}`)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<AccountBalanceWalletIcon />}
          label="Editar"
          sx={{ color: 'primary.main' }}
          onClick={() => handleCancelClick(row)}
          color="inherit"
        />
      ],
      sortable: false,
    }
  ];

  useEffect(()=> setRows(conveniosData),[])
  const handleCancelClick = (row) => {
    console.log("Acción cancelada para:", row);
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const volverPrimerPagina = () => {
    setPaginationModel((prevPaginationModel) => ({
      ...prevPaginationModel,
      page: 0,
    }));
  };

  return (
    <Box>
      {/* Título */}
      <div className="convenios_container">
        <h1 className="mt-1em">CONVENIOS</h1>

        {/* Filtros */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }} className="mt-1em">
          <TextField
            label="Estado"
            select
            defaultValue="Todos"
            sx={{ width: 150 }}
          >
            <MenuItem value="Todos">Todos</MenuItem>
            <MenuItem value="Pendiente">Pendiente</MenuItem>
            <MenuItem value="Cheque Recibido">Cheque Recibido</MenuItem>
            <MenuItem value="Cerrado">Cerrado</MenuItem>
          </TextField>

          <TextField
            label="Fecha desde"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ width: 180 }}
          />

          <TextField
            label="Fecha hasta"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ width: 180 }}
          />

          <Button variant="contained" color="primary">
            Buscar
          </Button>
          <Button variant="contained" color="primary">
            Exportar
          </Button>
        </Box>

        {/* DataGrid */}
        <Box sx={{ height: 450, width: '100%' }}>
          <ThemeProvider theme={themeWithLocale}>
            <StripedDataGrid
              rows={rows}
              columns={columnas}
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
                  themeWithLocale,
                },
              }}
              sx={{
                '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                  width: '8px',
                  visibility: 'visible',
                },
                '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                  backgroundColor: '#ccc',
                },
                '& .css-1iyq7zh-MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1A76D2 !important',
                  color: 'white'
                },
              }}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={pageSizeOptions}
            />
          </ThemeProvider>
        </Box>
      </div>
    </Box>
  );
};
