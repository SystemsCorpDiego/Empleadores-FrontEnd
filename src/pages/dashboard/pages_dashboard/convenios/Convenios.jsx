import * as locales from '@mui/material/locale';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import {
  Box,

  TextField,
  MenuItem,
  Button,

  createTheme,
} from '@mui/material';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {

  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
} from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import './Convenios.css';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { UserContext } from '@/context/userContext';

import { useNavigate } from 'react-router-dom';
import Cheques from './cheques/cheques';
import formatter from '@/common/formatter';
import ConveniosService from './ConveniosApi';
import { getRol } from '@/components/localStorage/localStorageService';
import CheckIcon from '@mui/icons-material/Check';
import TerminosYCondiciones from './TerminosYCondiciones/TerminosYCondiciones';
import localStorageService from '@/components/localStorage/localStorageService';
// Columnas del DataGrid

const crearNuevoRegistro = (props) => {
  const {

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

  const locale = 'esES';
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [open, setOpen] = useState(false);
  const [rol, setRol] = useState('');
  const [terminosYCondiciones, setTerminosYCondiciones] = useState(false);
  const empresaId = localStorageService.getEmpresaId(); // Cambia esto según tu lógica
  const total = 0;

  const handleClose = () => setOpen(false);

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        setRol(getRol());
        console.log('Rol:', rol);
      } catch (error) {
        console.error('Error fetching rol:', error);
      }
      try {
        const data = await ConveniosService.getAllConvenios(empresaId);
        setRows(data);
      } catch (error) {
        console.error('Error fetching convenios:', error);
      }
    };
    fetchData();
    console.log(rows);
  }, []);

  const handleOpen = (row) => {
    console.log(row);
    setTerminosYCondiciones(true);
    console.log(terminosYCondiciones);
  }

  const processRowUpdate = async (updatedRow, originalRow) => {
    if (updatedRow.estado !== originalRow.estado) {
      console.log('Estado:', updatedRow.estado, 'ID:', updatedRow.id);
    }
    try {
      const respuesta = await ConveniosService.updateConvenio(updatedRow.id, updatedRow.estado);
      console.log('Convenio actualizado:', respuesta);
    } catch (error) {
      console.error('Error al actualizar el convenio:', error);
    }

    return updatedRow;
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel((prevRowModesModel) => ({
      ...prevRowModesModel,
      [id]: { mode: 'view', ignoreModifications: true },
    }));
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel((prevRowModesModel) => ({
      ...prevRowModesModel,
      [id]: { mode: 'view' },
    }));
  };


  const columnas = [
    {
      field: 'cuit',
      headerName: 'CUIT',
      flex: 1.2,
      hide: !useContext(UserContext).isAdmin, // Esconde la columna si el usuario no es admin
    },
    { field: 'razonSocial', headerName: 'Razón Social', flex: 1 },
    {
      field: 'fecha', headerName: 'Fecha', flex: 1, valueFormatter: (params) =>
        params.value ? formatter.dateString(params.value) : '',
    },
    { field: 'numero', headerName: 'N°', flex: 0.1, align: 'right' },
    {
      field: 'capital',
      headerName: 'Deuda Original',
      flex: 1.2,
      align: 'right',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    },
    {
      field: 'interes',
      headerName: 'Intereses Financ.',
      flex: 1,
      align: 'right',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    },
    {
      field: 'saldoFavor',
      headerName: 'Sdo a Favor utilizado',
      flex: 1,
      align: 'right',
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    },
    {
      field: 'total',
      headerName: 'Total Convenio',
      flex: 0.8,
      align: 'right',
      valueGetter: (params) => {
        const capital = Number(params.row.capital) || 0;
        const interes = Number(params.row.interes) || 0;
        const saldoFavor = Number(params.row.saldoFavor) || 0;
        return capital + interes + saldoFavor; //Se suma saldo a favor porque es un valor negativo
      },
      valueFormatter: (params) => formatter.currency.format(params.value || 0),
    },
    {
      field: 'cantCuotas',
      headerName: 'Cant. Cuotas',
      flex: 0.8,
      align: 'right',
    },
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
    {
      field: 'estado',
      headerName: 'Estado',
      flex: 1,
      editable: rol === 'OSPIM_EMPLEADO' ? true : false,
      type: 'singleSelect',
      valueOptions: ['Pendiente', 'Cerrado', 'Cheque Recibido'],
    },

    {
      field: 'acciones',
      headerName: 'Acciones',
      type: 'actions',
      flex: 1.5,
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === 'edit';
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<CheckIcon />}
              label="Guardar"
              onClick={handleSaveClick(id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
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
            onClick={() => navigate(`/dashboard/convenio/${row.id}/cuotas`)}
            color="inherit"
          />,
          ...(rol !== 'OSPIM_EMPLEADO'
            ? [
              <GridActionsCellItem
                icon={<CheckIcon />}
                label="Aceptar Terminos y condiciones"
                title="Aceptar Terminos y condiciones"
                sx={{ color: 'primary.main' }}
                color="inherit"
                onClick={() => handleOpen(row)}
              />,
            ]
            : []),
        ];
      },
      sortable: false,
    },
  ];


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

      <TerminosYCondiciones open={terminosYCondiciones} setOpen={setTerminosYCondiciones} />

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
