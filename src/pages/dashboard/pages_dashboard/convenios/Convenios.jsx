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
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
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

import {axiosGestionDeudas} from './../gestion_deudas/Entidades/GestionApi';
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
  const [rowTyC, setRowTyC] = useState(null);
  const total = 0;
  const [filtros, setFiltros] = useState({
    estado: 'TODOS',
    fechaDesde: '',
    fechaHasta: '',
  });

  const KVESTADOS = {
    "PRCH": "Pendiente en recepción de cheque",
    "CHRECI": "Cheque recibido",
    "CHRECH": "Cheque rechazado",
    "PRES": "Presentado",
    "APROB": "Aprobado",
    "RECH": "Rechazado",
    "OBSR": "Observado",
    "CAIDO": "Caido"
  };

  //const handleClose = () => setOpen(false);

  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

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

  useEffect(() => {

    fetchData();
    console.log('Este es el rol', rol)
    console.log(rows);
  }, []);

  // Solución al problema de rowTyC undefined en TerminosYCondiciones
  useEffect(() => {
    // Cuando terminosYCondiciones se abre, rowTyC ya está actualizado
    if (terminosYCondiciones) {
      console.log('rowTyC actualizado para TerminosYCondiciones:', rowTyC);
    }
  }, [terminosYCondiciones, rowTyC]);
  const handleOpen = (row) => {
    console.log(row);
    setRowTyC(row);
    console.log('Row para Terminos y Condiciones:', rowTyC);
    setTerminosYCondiciones(true);


    console.log(terminosYCondiciones);
  }

  const processRowUpdate = async (updatedRow, originalRow) => {
    if (updatedRow.estado !== originalRow.estado) {
      console.log('Estado:', updatedRow.estado, 'ID:', updatedRow.id);
    }
    try {
      const respuesta = await ConveniosService.updateConvenio(updatedRow);
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

  const handleSaveClick = (id, row) => () => {
    setRowModesModel((prevRowModesModel) => ({
      ...prevRowModesModel,
      [id]: { mode: 'view' },
    }));

    console.log('Guardando cambios para el convenio:', rows[id]);

  };
  const handleImprimir = async (row) => {
    await ConveniosService.imprimirConvenio(row.cuit, row.id);
  };

  const handleDownload = (row) => async () => {
    console.log('Descargando cuotas para el convenio:', row.id);
    try {


      const empresaID = await axiosGestionDeudas.getEmpresaByCuit(row.cuit)
      const cuotas = await consultarCuotas(row.id, empresaID)
      if (!Array.isArray(cuotas)) throw new Error('Formato de cuotas inesperado');

      const response = await axiosGestionDeudas.getDeclaracionesJuradasEditar(empresaID,row.id);
      const actas = response.actas;
      console.log('Actas:', actas);
      const nroActasStr = Array.isArray(actas) && actas.length > 0
        ? actas.map(a => a.nroActa).join('/ ')
        : '';

        console.log('Números de actas:', nroActasStr);
      const declaracionesJuradas = response.declaracionesJuradas;

      console.log('Declaraciones Juradas:', declaracionesJuradas);
      const periodosStr = Array.isArray(declaracionesJuradas) && declaracionesJuradas.length > 0
        ? declaracionesJuradas.map(a => a.periodo).join('/ ')
        : '';
      console.log('Períodos de declaraciones juradas:', periodosStr);

      console.log('Datos de la empresa:', response);

      const convenioInfo = {
        cuit: row.cuit,

        convenioId: row.id,
        fecha: row.fecha,
        numero: row.numero,
        capital: row.capital,
        interes: row.interes,
        saldoFavor: row.saldoFavor,
        medioPago: row.medioPago,
        estado: row.estado,
        periodos: periodosStr,
        actas: nroActasStr
      };

      const allRows = cuotas.map((cuota) => ({
        ...convenioInfo,
        nroCuota: cuota.numero,
        importeCuota: cuota.importe,
        cheques: cuota.chequesNro,
        totalCheques: cuota.chequesTotal,
        vencimiento: cuota.vencimiento
      }));

      const headerMap = {
        cuit: 'CUIT',
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
        vencimiento: 'Fecha de vto de la cuota',
        periodos: 'Periodos',
        actas: 'Actas',
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
      a.download = `${row.cuit}_convenio_${row.id}_cuotas.csv`;
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
      visible: rol == 'OSPIM_EMPLEADO' ? true : false,
      flex: 1.2,
      hide: !useContext(UserContext).isAdmin, // Esconde la columna si el usuario no es admin
    },
    { field: 'razonSocial', headerName: 'Razón Social', flex: 1, visible: rol == 'OSPIM_EMPLEADO' ? true : false },
    {
      field: 'fecha', headerName: 'Fecha', flex: 1, valueFormatter: (params) =>
        params.value ? formatter.dateString(params.value) : '',


    },
    { field: 'numero', headerName: 'Numero Convenio', flex: 0.1, align: 'right' },
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
      flex: 1,
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
      field: 'cuotas',
      headerName: 'Cuotas',
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
      valueOptions: Object.entries(KVESTADOS).map(([key, value]) => ({
        value: key,
        label: value,
      })),
      valueFormatter: (params) => KVESTADOS[params.value] || params.value,
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
        // Solo mostrar el botón "Aceptar Terminos y condiciones" si el estado NO es 'PRES'
        return [
          <GridActionsCellItem
            icon={<DownloadIcon />}
            label="Download"
            title="Descargar"
            sx={{ color: 'primary.main' }}
            onClick={handleDownload(row)}
          />,
          <GridActionsCellItem
            icon={<LocalPrintshopIcon />}
            label="Print"
            title="Imprimir"
            color="inherit"
            sx={{ color: 'primary.main' }}
            onClick={() => handleImprimir(row)}
          />,
          ...(row.estado !== 'PRES' && row.estado !== 'Presentado' 
            ? [
          <GridActionsCellItem
            icon={<EditIcon />} 
            label="Editar"
            title="Editar"
            sx={{ color: 'primary.main' }}
            onClick={() => navigate(`/dashboard/gestiondeuda/${row.id}/editar/${row.entidad}/convenio/${row.id}/cuit/${row.cuit}`)}
            color="inherit"
          />,
              ]
            : []),
          <GridActionsCellItem
            icon={<AccountBalanceWalletIcon />}
            label="Cheques"
            title="Cheques"
            sx={{ color: 'primary.main' }}
            onClick={() => navigate(`/dashboard/convenio/${row.id}/cuotas`)}
            color="inherit"
          />,
          ...(

            rol !== 'OSPIM_EMPLEADO'
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

  const columnas_empleador = [

    {
      field: 'fecha', headerName: 'Fecha', flex: .8, valueFormatter: (params) =>
        params.value ? formatter.dateString(params.value) : '',
    },
    { field: 'numero', headerName: 'Nro Convenio', flex: 1, align: 'right' },
    {
      field: 'capital',
      headerName: 'Deuda Original',
      flex: 1,
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
      field: 'cuotas',
      headerName: 'Cuotas',
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
      editable: false,
      valueOptions: Object.entries(KVESTADOS).map(([key, value]) => ({
        value: key,
        label: value,
      })),
      valueFormatter: (params) => KVESTADOS[params.value] || params.value,
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
              onClick={handleSaveClick(id, row)}
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
            icon={<LocalPrintshopIcon />}
            label="Print"
            title="Imprimir"
            color="inherit"
            sx={{ color: 'primary.main' }}
            onClick={() => handleImprimir(row)}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            title="Editar"
            sx={{ color: 'primary.main' }}
            onClick={() => navigate(`/dashboard/gestiondeuda/${row.id}/editar/${row.entidad}/convenio/${row.id}/cuit/${row.cuit}`)}
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
          ...(rol !== 'OSPIM_EMPLEADO' && row.estado !== 'PRES' && row.estado !== 'Presentado'
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

    ConveniosService.getConveniosByDateAndState(filtros, empresaId, rol)
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
  

  return (
    <Box>

      {(rowTyC !== undefined && rowTyC !== null) && (<TerminosYCondiciones open={terminosYCondiciones} setOpen={setTerminosYCondiciones} rowTyC={rowTyC} setRowTyC={setRowTyC} fetchData={fetchData} />)}

      <div className="convenios_container">
        <h1 className="mt-1em">{rol == 'OSPIM_EMPLEADO' ? 'Consulta Convenios' : 'Mis convenios'}</h1>

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
            <MenuItem value="CHRECI">Cheque Recibido</MenuItem>
            <MenuItem value="CHRECH">Cheque Rechazado</MenuItem>
            <MenuItem value="PRES">Presentado</MenuItem>
            <MenuItem value="APROB">Aprobado</MenuItem>
            <MenuItem value="PRCH">Pendiente en recepción de cheque</MenuItem>
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
          
        </Box>
        {/* DataGrid */}
        <Box sx={{ height: 450, width: '100%' }}>
          <ThemeProvider theme={themeWithLocale}>
            <StripedDataGrid
              rows={rows}
              columns={rol == 'OSPIM_EMPLEADO' ? columnas : columnas_empleador}
              //Revisar como hacer para poner los colores de manera correcta

              //getRowClassName={(params) =>
              //  rows?.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
              // }
              initialState={{
                sorting: {
                  sortModel: [{ field: 'fecha', sort: 'desc' }], // Cambia a 'asc' si prefieres ascendente
                },
              }}
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
