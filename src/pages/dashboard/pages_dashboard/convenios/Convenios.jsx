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
import { consultar as consultarCuotas } from './cuotas/CuotasApi';
//import { consultarCuotas } from './cuotas/CuotasApi';
//import { getConveniosByDateAndState } from './ConveniosApi';
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
  const [filtros, setFiltros] = useState({
    estado: 'TODOS',
    fechaDesde: '',
    fechaHasta: '',
  });

  //const handleClose = () => setOpen(false);

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
    console.log('Este es el rol', rol)
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

const handleDownload = (row) => async () => {
  console.log('Descargando cuotas para el convenio:', row.id);
  try {
    const cuotas = await consultarCuotas(row.id, empresaId);
    if (!Array.isArray(cuotas)) throw new Error('Formato de cuotas inesperado');

    const convenioInfo = {
      convenioId: row.id,
      fecha: row.fecha,
      numero: row.numero,
      capital: row.capital,
      interes: row.interes,
      saldoFavor: row.saldoFavor,
      medioPago: row.medioPago,
      estado: row.estado,
    };

    const allRows = cuotas.map((cuota) => ({
      ...convenioInfo,
      nroCuota: cuota.nro_cuota,
      importeCuota: cuota.importeCuota,
      cheques: cuota.cheques,
      totalCheques: cuota.totalCheques,
    }));

    const headerMap = {
      convenioId: 'ID Convenio',
      fecha: 'Fecha',
      numero: 'Numero',
      capital: 'Deuda Original',
      interes: 'Intereses Financieros',
      saldoFavor: 'Saldo a Favor',
      medioPago: 'Medio de Pago',
      estado: 'Estado',
      nroCuota: 'Numero de Cuota',
      importeCuota: 'Importe de Cuota',
      cheques: 'Cheques',
      totalCheques: 'Total Cheques',
    };

    const headers = Object.keys(headerMap);
    const headerLabels = headers.map((key) => headerMap[key]);

    const csvContent = [
      headerLabels.join(','), // encabezados legibles
      ...allRows.map((r) =>
        headers.map((h) => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `convenio_${row.id}_cuotas.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generando CSV:', error);
    alert('Ocurrió un error al descargar las cuotas del convenio.');
  }
};

  const columnas = [
    {
      field: 'cuit',
      headerName: 'CUIT',
      visible: rol == 'OSPIM_EMPLEADO' ? true : false ,
      flex: 1.2,
      hide: !useContext(UserContext).isAdmin, // Esconde la columna si el usuario no es admin
    },
    { field: 'razonSocial', headerName: 'Razón Social', flex: 1, visible: rol == 'OSPIM_EMPLEADO'? true : false },
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
        return capital + interes - saldoFavor; //Se suma saldo a favor porque es un valor negativo
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
      valueOptions: ['Pendiente en recepción de cheque', 'Cheque Recibido', 'Cheque Rechazado'],
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
            onClick={handleDownload(row)}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            title="Editar"
            sx={{ color: 'primary.main' }}
            onClick={() => navigate(`/dashboard/gestiondeuda/${row.id}/editar/${row.entidad}/convenio/${row.id}`)}
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

  const handleBuscar = (filtros) => {
    //const { estado, fechaDesde, fechaHasta } = filtros;
    let filteredRows = rows;

    ConveniosService.getConveniosByDateAndState(filtros, empresaId)
      .then((data) => {
        setRows(data);
      })
      .catch((error) => {
        console.error('Error al filtrar convenios:', error);
      });
    /*
    if (estado && estado !== 'Todos') {
      filteredRows = filteredRows.filter((row) => row.estado === estado);
    }

    if (fechaDesde) {
      filteredRows = filteredRows.filter((row) => new Date(row.fecha) >= new Date(fechaDesde));
    }

    if (fechaHasta) {
      filteredRows = filteredRows.filter((row) => new Date(row.fecha) <= new Date(fechaHasta));
    }
    */
    setRows(filteredRows);
  }
  const handleExportar = (filtros) => {
    const { estado, fechaDesde, fechaHasta } = filtros;
    let filteredRows = rows;

    if (estado && estado !== 'TODOS') {
      filteredRows = filteredRows.filter((row) => row.estado === estado);
    }

    if (fechaDesde) {
      filteredRows = filteredRows.filter((row) => new Date(row.fecha) >= new Date(fechaDesde));
    }

    if (fechaHasta) {
      filteredRows = filteredRows.filter((row) => new Date(row.fecha) <= new Date(fechaHasta));
    }

    // Aquí puedes implementar la lógica para exportar los datos filtrados
    console.log('Exportando datos:', filteredRows);
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
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            sx={{ width: 150 }}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="PENDIENTE">Pendiente</MenuItem>
            <MenuItem value="CHEQUERECIBIDO">Cheque Recibido</MenuItem>
            <MenuItem value="CERRADO">Cerrado</MenuItem>
          </TextField>

          <TextField
            label="Fecha desde"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filtros.fechaDesde}
            onChange={(e) => setFiltros({ ...filtros, fechaDesde: e.target.value })}
            sx={{ width: 180 }}
          />

          <TextField
            label="Fecha hasta"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filtros.fechaHasta}
            onChange={(e) => setFiltros({ ...filtros, fechaHasta: e.target.value })}
            sx={{ width: 180 }}
          />

          <Button variant="contained" color="primary" onClick={() => handleBuscar(filtros)}>
            Buscar
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleExportar(filtros)}>
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
