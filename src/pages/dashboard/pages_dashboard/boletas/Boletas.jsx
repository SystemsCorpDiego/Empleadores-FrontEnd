import React, { useContext, useEffect, useState, useMemo } from 'react';
import { TextField, Button, IconButton, Box } from '@mui/material';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

import {
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { axiosBoletas } from './BoletasApi';
import { boletaPdfDownload } from '@/common/api/BoletaCommonApi';
import localStorageService from '@/components/localStorage/localStorageService';
import formatter from '@/common/formatter';
import dayjs from 'dayjs';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import './Boletas.css';
import { UserContext } from '@/context/userContext';
import Stack from '@mui/material/Stack';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import * as locales from '@mui/material/locale';
import PropTypes from 'prop-types';
import { ThreeCircles } from 'react-loader-spinner';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <span>{children}</span>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const Boletas = () => {
  const ID_EMPRESA = localStorageService.getEmpresaId();
  const ahora = dayjs().startOf('month');
  const ahoraMenosUnAnio = ahora.add(-11, 'month');
  const [fromDate, setFromDate] = useState(ahoraMenosUnAnio);
  const [toDate, setToDate] = useState(ahora);
  const [boletas, setBoletas] = useState([]);
  const [boletasVisibles, setBoletasVisibles] = useState([]);
  const [boletasSinAfiliados, setBoletasSinAfiliados] = useState([]); //Esta la necesito para generar el csv
  const [boletasSinDDJJ, setBoletasSinDDJJ] = useState([]);
  const [tabState, setTabState] = useState(0);
  const [showLoading, setShowLoading] = useState([])
  const theme = useTheme();
  const [locale, setLocale] = useState('esES');
  const { paginationModel, setPaginationModel, pageSizeOptions } =
    useContext(UserContext);
  const navigate = useNavigate();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  useEffect(() => {
    fetchData();
  }, []);
  const handleChangeTabState = (event, value) => setTabState(value);

  const fetchData = async () => {
    try {
      let desde = null;
      if (fromDate !== null) {
        desde = fromDate.startOf('month').format('YYYY-MM-DD');
      }
      let hasta = null;
      if (toDate !== null) {
        hasta = toDate.startOf('month').format('YYYY-MM-DD');
      }

      const response = await axiosBoletas.getBoletasEmpresa(
        ID_EMPRESA,
        desde,
        hasta,
      );
      console.log('axiosBoletas.getBoletasEmpresa - response:', response);
      setBoletas(response['con_ddjj']);

      //console.log('response.con_ddjj: ', response['con_ddjj']);
      const auxBoletasVisibles = response['con_ddjj'].flatMap((boleta) => ({
        ...boleta,
      }));
      //console.log('auxBoletasVisibles: ', auxBoletasVisibles);

      setBoletasVisibles(auxBoletasVisibles);
      setBoletasSinDDJJ(response['sin_ddjj']);
      setBoletasSinAfiliados(
        response['sin_ddjj'].flatMap((boleta) => {
          const { afiliados, ...rest } = boleta;
          return { ...rest };
        }),
      );
      setShowLoading(false)
    } catch (error) {
      console.error('Error al obtener las boletas:', error);
      setShowLoading(false)
    }
  };

  const handleViewClick = (boletaDetalle) => {
    navigate(`/dashboard/detalleboleta/${boletaDetalle.id}`);
  };

  const handleGenerarBepClick = async (row) => {
    console.log('handleGenerarBepClick - row: ', row);
    const data = await axiosBoletas.generarBep(ID_EMPRESA, row.id);
    console.log('handleGenerarBepClick - data: ', data);
    if (data != null && data.bep && data.bep != null) {
      row.formaDePago = row.formaDePago + ' (BEP)';
      row.requiereBep = false;
      const newRows = boletasVisibles.map((reg) =>
        row.id == reg.id ? row : reg,
      );
      setBoletasVisibles(newRows);
    }
  };

  return (
    <div className="boletas_container">
      {window.location.href.split('/').slice(3).join('/') ===
        'dashboard/ddjj' || <h1>Boletas</h1>}
      <div
        style={{
          display: 'flex',
          justifyContent: 'initial',
          alignItems: 'center',
        }}
        className="mb-4em"
      >
        <div>
          <Stack
            spacing={4}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <DemoContainer components={['DatePicker']}>
              <DesktopDatePicker
                label={'Periodo desde'}
                views={['month', 'year']}
                closeOnSelect={true}
                onChange={(oValue) => {
                  setFromDate(oValue);
                }}
                value={fromDate}
              />
            </DemoContainer>

            <DemoContainer components={['DatePicker']}>
              <DesktopDatePicker
                label={'Periodo hasta'}
                views={['month', 'year']}
                closeOnSelect={true}
                onChange={(oValue) => setToDate(oValue)}
                value={toDate}
              />
            </DemoContainer>
          </Stack>
        </div>
        <div>
          <Button
            variant="contained"
            onClick={fetchData}
            style={{ marginLeft: '2em' }}
          >
            Buscar
          </Button>
        </div>
      </div>
      <ThemeProvider theme={themeWithLocale}>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{ borderBottom: 1, borderColor: 'divider', marginTop: '50px' }}
          >
            <Tabs value={tabState} onChange={handleChangeTabState}>
              <Tab
                label={'Boletas Periodo'}
                {...a11yProps(0)}
                sx={{ fontSize: '1.2rem' }}
              />
              <Tab
                label="Boletas Actas"
                {...a11yProps(1)}
                sx={{ fontSize: '1.2rem' }}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={tabState} index={0}>
            <Box
              style={{ height: 650, width: '100%' }}
              sx={{
                width: '100%',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1A76D2',
                  color: 'white',
                },
              }}
            >
              <ThreeCircles
                visible={showLoading}
                height="100"
                width="100"
                color="#1A76D2"
                ariaLabel="three-circles-loading"
                wrapperStyle={{
                  margin: '15%',
                  marginLeft: '50%',
                }}
                wrapperClass=""
              />
              <DataGrid
                rows={boletasVisibles}
                columns={[
                  {
                    field: 'periodo',
                    headerName: 'Periodo',
                    flex: 0.8,
                    valueFormatter: (params) =>
                      formatter.periodoString(params.value),
                  },
                  { field: 'tipo_ddjj', headerName: 'Tipo DDJJ', flex: 1 },
                  { field: 'numero_boleta', headerName: 'Número', flex: 0.8 },
                  { field: 'descripcion', headerName: 'Concepto', flex: 1 },
                  {
                    field: 'total_final',
                    headerName: 'Importe Boleta',
                    flex: 1,
                    align: 'right',
                    valueFormatter: (params) => {
                      return formatter.currencyString(params?.value);
                    },
                  },
                  {
                    field: 'importe_recibido',
                    headerName: 'Importe Recibido',
                    flex: 1,
                    align: 'right',
                    valueFormatter: (params) => {
                      return formatter.currencyString(params?.value);
                    },
                  },
                  {
                    field: 'fecha_de_pago',
                    headerName: 'Fecha de Pago',
                    flex: 1,
                    valueFormatter: (params) =>
                      params.value ? formatter.dateString(params.value) : '',
                  },
                  {
                    field: 'intencionDePago',
                    headerName: 'Intención de Pago',
                    flex: 1,
                    valueFormatter: (params) =>
                      params.value ? formatter.dateString(params.value) : '',
                  },
                  {
                    field: 'formaDePago',
                    headerName: 'Método de Pago',
                    flex: 0.8,
                  },
                  {
                    field: 'acciones',
                    headerName: 'Acciones',
                    flex: 1,
                    renderCell: (params) => {
                      if (params.row.baja !== null) {
                        return (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleViewClick(params.row)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </>
                        );
                      }

                      if (params.row.requiereBep) {
                        return (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleViewClick(params.row)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => {
                                boletaPdfDownload(ID_EMPRESA, params.row.id);
                              }}
                            >
                              <PrintIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleViewClick(params.row)}
                              disabled={!!params.row.fecha_de_pago}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleGenerarBepClick(params.row)}
                            >
                              <RequestQuoteIcon />
                            </IconButton>
                          </>
                        );
                      }
                      return (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleViewClick(params.row)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              boletaPdfDownload(ID_EMPRESA, params.row.id);
                            }}
                          >
                            <PrintIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleViewClick(params.row)}
                            disabled={!!params.row.fecha_de_pago}
                          >
                            <EditIcon />
                          </IconButton>
                        </>
                      );
                    },
                  },
                ]}
                getRowClassName={(params) =>
                  boletasVisibles.indexOf(params.row) % 2 === 0 ? 'even' : ''
                }
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={pageSizeOptions}
                components={{
                  Toolbar: () => (
                    <GridToolbarContainer>
                      <GridToolbarColumnsButton />
                      <GridToolbarFilterButton />
                      <GridToolbarExport />
                    </GridToolbarContainer>
                  ),
                }}
                localeText={{
                  toolbarColumns: 'Columnas',
                  toolbarFilters: 'Filtros',
                  toolbarExport: 'Exportar',
                }}
              />
            </Box>
          </CustomTabPanel>
          <CustomTabPanel value={tabState} index={1}>
            <Box
              style={{ height: 650 }}
              sx={{
                width: '100%',
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#1A76D2',
                  color: 'white',
                },
              }}
            >
              <ThreeCircles
                visible={showLoading}
                height="100"
                width="100"
                color="#1A76D2"
                ariaLabel="three-circles-loading"
                wrapperStyle={{
                  margin: '15%',
                  marginLeft: '50%',
                }}
                wrapperClass=""
              />
              <DataGrid
                rows={boletasSinDDJJ}
                columns={[
                  {
                    field: 'numero_boleta',
                    headerName: 'Nro. Boleta',
                    flex: 0.5,
                  },
                  {
                    field: 'entidad',
                    headerName: 'Entidad',
                    flex: 0.8,
                    valueFormatter: (params) =>
                      params.value ? params.value.replace('-', '/') : '',
                  },
                  {
                    field: 'nroActa',
                    headerName: 'Nro. Acta',
                    flex: 1,
                    align: 'right',
                  },
                  {
                    field: 'importe',
                    headerName: 'Importe',
                    align: 'right',
                    flex: 1,
                    valueFormatter: (params) =>
                      params.value
                        ? formatter.currencyString(params.value)
                        : '',
                  },
                  {
                    field: 'intencionDePago',
                    headerName: 'Intención de Pago',
                    flex: 1,
                    valueFormatter: (params) =>
                      params.value ? formatter.dateString(params.value) : '',
                  },

                  {
                    field: 'acciones',
                    headerName: 'Acciones',
                    flex: 0.5,
                    renderCell: (params) => (
                      <>
                        <IconButton
                          size="small"
                          onClick={() => {
                            boletaPdfDownload(ID_EMPRESA, params.row.id);
                          }}
                        >
                          <PrintIcon />
                        </IconButton>
                      </>
                    ),
                  },
                ]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={pageSizeOptions}
                components={{
                  Toolbar: () => (
                    <GridToolbarContainer>
                      <GridToolbarColumnsButton />
                      <GridToolbarFilterButton />
                      <GridToolbarExport />
                    </GridToolbarContainer>
                  ),
                }}
                localeText={{
                  toolbarColumns: 'Columnas',
                  toolbarFilters: 'Filtros',
                  toolbarExport: 'Exportar',
                }}
              />
            </Box>
          </CustomTabPanel>
        </Box>
      </ThemeProvider>
      <p className="leyenda">
        La visualización de los pagos efectuados puede tener una demora
      </p>
    </div>
  );
};
