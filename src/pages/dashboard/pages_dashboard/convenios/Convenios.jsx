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
import Cheques from './cheques/cheques';
import formatter from '@/common/formatter';
// Datos de ejemplo para el DataGrid
const conveniosData = [
  {
    id: 1,
    fecha: 'MM/AAAA',
    numero: 1,
    deuda: 20000.0,
    interes: 100.0,
    saldo: 200.0,
    total: 20100.0,
    cuota: 3,
    medioPago: 'Cheque',
    //cheques: '',
    estado: 'Pendiente...',
  },
  {
    id: 2,
    fecha: 'MM/AAAA',
    numero: 2,
    deuda: 30000.0,
    interes: 3000.0,
    saldo: 33000.0,
    total: 33000.0,
    cuota: 2,
    medioPago: 'Cheque',
    //cheques: [{ id: 1, numero: '123', monto: 5000.0, cuota: 2 }],
    estado: 'Cheque Recibido',
  },
  {
    id: 3,
    fecha: 'MM/AAAA',
    numero: 3,
    deuda: 120000.0,
    interes: 20000.0,
    saldo: 140000.0,
    total: 140000.0,
    cuota: 1,
    medioPago: 'Cheque',
    cheques: '',
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
  const [open, setOpen] = useState(false);
  const [cheques, setCheques] = useState([{ id: 1, numero: '', monto: '' }]);
  const [chequesPorFila, setChequesPorFila] = useState({});
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [total, setTotal] = useState(0);

  const handleOpen = (row) => {
    console.log(row.id);
    setFilaSeleccionada(row.id);
    console.log(row.total);
    setTotal(Number(row.total) || 0);
    console.log(total);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );
/**
  useEffect(() => {
    setRows(conveniosData);
    //const inicialCheques = {};
    //conveniosData.forEach((row) => {
    //  inicialCheques[row.id] = row.cheques || [];
    //});
    //setChequesPorFila(inicialCheques);
  }, []);
 */
  const actualizarCheques = (chequesActualizados) => {
    setChequesPorFila((prev) => ({
      ...prev,
      [filaSeleccionada]: chequesActualizados,
    }));
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === filaSeleccionada
          ? { ...row, cheques: chequesActualizados }
          : row,
      ),
    );
  };

  const columnas = [
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'numero', headerName: 'N°', flex: 0.1, align: 'right' },
    {
      field: 'deuda',
      headerName: 'Deuda Original',
      flex: 1.2,
      align: 'right',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    },
    {
      field: 'interes',
      headerName: 'Intereses Financ.',
      flex: 1.2,
      align: 'right',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    },
    {
      field: 'saldo',
      headerName: 'Sdo a Favor utilizado',
      flex: 1.5,
      align: 'right',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    },
    {
      field: 'total',
      headerName: 'Total Convenio',
      flex: 1,
      align: 'right',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    },
    { field: 'cuota', headerName: 'Cuotas', flex: 0.5, align: 'right' },
    { field: 'medioPago', headerName: 'Medio Pago', flex: 1 },
    /*{
      field: 'cheque',
      headerName: 'N° Cheque',
      flex: 1,
      valueGetter: (params) =>
        params.row.cheques && params.row.cheques.length > 0
          ? params.row.cheques.map((c) => c.numero).join('/ ')
          : 'Sin Cheques',
    },*/
    { field: 'estado', headerName: 'Estado', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      type: 'actions',
      flex: 1.5,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<DownloadIcon />}
          label="Download"
          title="Descargar"
          sx={{ color: 'primary.main' }}
          onClick={() => console.log(row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          title="Editar"
          sx={{ color: 'primary.main' }}
          onClick={() => navigate(`/dashboard/gestiondeuda/${row.id}`)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<AccountBalanceWalletIcon />}
          label="Cheques"
          title="Cheques"
          sx={{ color: 'primary.main' }}
          onClick={() => handleOpen(row)}
          //onClick={() =>  navigate(`/dashboard/convenio/${row.numero}/cuotas`)}
          color="inherit"
        />,
      ],
      sortable: false,
    },
  ];

  useEffect(() => setRows(conveniosData), []);
  const handleCancelClick = (row) => {
    console.log('Acción cancelada para:', row);
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
      <Cheques
        open={open}
        handleClose={handleClose}
        convenio={conveniosData.id}
        cuota={conveniosData.cuota}
        //cheques={chequesPorFila[filaSeleccionada] || []}
        //setCheques={actualizarCheques}
        total={total}
      />
      <div className="convenios_container">
        <h1 className="mt-1em">Mis convenios</h1>

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
                  color: 'white',
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
