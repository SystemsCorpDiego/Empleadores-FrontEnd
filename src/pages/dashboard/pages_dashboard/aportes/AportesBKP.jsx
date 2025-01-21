import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Tooltip,
  alpha,
  styled,
} from '@mui/material';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import * as locales from '@mui/material/locale';
import { StripedDataGrid, dataGridStyle } from '@/common/dataGridStyle';
import './Aportes.css';
import { axiosAportes } from './AportesApi';
import {
  GridRowModes,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import dayjs from 'dayjs';
import CurrencyInput from 'react-currency-input-field';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import formatter from '@/common/formatter';

const crearNuevoRegistro = ({
  setRows,
  setRowModesModel,
  showQuickFilter,
  themeWithLocale,
  handleOpen,
  setPeticionTitulo,
}) => {
  const altaHandleClick = () => {
    handleOpen();
    setPeticionTitulo('Alta de Aportes');
  };
  return (
    <GridToolbarContainer
      theme={themeWithLocale}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button color="primary" startIcon={<AddIcon />} onClick={altaHandleClick}>
        Nuevo Registro
      </Button>
      <GridToolbar showQuickFilter={showQuickFilter} />
    </GridToolbarContainer>
  );
};

export const Aportes = () => {
  const [locale, setLocale] = useState('esES');
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 50,
    page: 0,
  });
  const [open, setOpen] = useState(false);
  const [peticionTitulo, setPeticionTitulo] = useState('');
  const [entidades, setEntidades] = useState([]);
  const [aportes, setAportes] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [valor, setValor] = useState(0);
  const [base, setBase] = useState([]);
  const [camara, setCamara] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [antiguedad, setAntiguedad] = useState([]);
  const [dataModal, setDataModal] = useState({
    id: null,
    entidad: null,
    aporte: null,
    socio: '',
    calculoTipo: '',
    calculoValor: '',
    calculoBase: '',
    camara: '',
    camaraCategoria: '',
    antiguedad: '',
    desde: null,
    hasta: null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const theme = useTheme();

  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[locale]),
    [locale, theme],
  );

  const consultaAportesRows = async () => {
    const response = await axiosAportes.consultar();
    console.log(response);
    setRows(response);
  };

  //const consultaEntidades = async () => {
  //  const response = await axiosAportes.consultarEntidades();
  //  setEntidades(response);
  //};

  const consultaAportes = async () => {
    const response = await axiosAportes.consultarAportes();
    setAportes(response);
  };

 //const consultaTipo = async () => {
 //  const response = await axiosAportes.consultarTipo();
 //  setTipo(response);
 //};

 //const consultaBase = async () => {
 //  const response = await axiosAportes.consultarBase();
 //  setBase(response);
 //};

  //const consultaCamara = async () => {
  //  const response = await axiosAportes.consultarCamara();
  //  setCamara(response);
  //};

  const consultaCategoria = async (camara) => {
    const response = await axiosAportes.consultarCategoria(camara);
    setCategoria(response);
  };

  const consultaAntiguedad = async (categoria) => {
    const response = await axiosAportes.consultarAntiguedad(categoria);
    console.log('Años de antiguedad');
    console.log(response);
    console.log(response[0].antiguedad);
    setAntiguedad(response[0].antiguedad);
  };

  const editarAporte = (row) => () => {
    handleOpen();
    setPeticionTitulo('Edición de Aportes');

    setDataModal({
      id: row.id,
      entidad: entidades.find((e) => e.codigo === row.entidad) || null,
      aporte: aportes.find((a) => a.codigo === row.aporte) || null,
      socio: row?.socio || '',
      calculoTipo: row?.calculoTipo || '',
      calculoValor: row?.calculoValor || 0,
      calculoBase: row?.calculoBase ? row.calculoBase : '',
      camara: row?.camara ? row.camara : '',
      camaraCategoria: row?.camaraCategoria ? row.camaraCategoria : '',
      antiguedad: row?.antiguedad ? row.antiguedad : '',
      desde: row.desde === null ? null : dayjs(row.desde),
      hasta: row.hasta === null ? null : dayjs(row.hasta),
    });
  };

  const eliminarAportes = (row) => async () => {
    const data = await axiosAportes.eliminar(row.id);
    if (data) {
      setRows(rows.filter((rowAux) => rowAux.id !== row.id));
    }
  };

  const handleChangeDataModal = (newValue, field) => {
    setDataModal((prevDataModal) => ({
      ...prevDataModal,
      [field]: newValue,
    }));
  };

  const cancelarEdicion = () => {
    handleClose();
    setDataModal({
      id: null,
      entidad: null,
      aporte: null,
      socio: '',
      calculoTipo: '',
      calculoValor: 0,
      calculoBase: '',
      camara: '',
      camaraCategoria: '',
      antiguedad: '',
      desde: null,
      hasta: null,
    });
  };

  useEffect(() => {
    consultaAportesRows();
    consultaAportes();
  }, []);

  useEffect(() => {
    if (dataModal.camara) {
      consultaCategoria(dataModal.camara);
    }
  }, [dataModal.camara]);

  useEffect(() => {
    if (dataModal.camaraCategoria) {
      consultaAntiguedad(dataModal.camaraCategoria);
    }
  }, [dataModal.camaraCategoria]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const str = dataModal.calculoValor;
    const num = parseFloat(str);
    const valorFloat = parseFloat(num.toFixed(2));

    const desdeDayjs = dayjs(dataModal.desde)
      .set('hour', 3)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    const hastaDayjs = dayjs(dataModal.hasta)
      .set('hour', 3)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    const aporteFinal = {
      id: dataModal.id,
      entidad: dataModal?.entidad?.codigo || null,
      aporte: dataModal?.aporte?.codigo || null,
      socio: dataModal?.socio || null,
      calculoTipo: dataModal?.calculoTipo || null,
      calculoValor: valorFloat ? valorFloat : 0,
      calculoBase: dataModal?.calculoBase ? dataModal.calculoBase : null,
      camara: dataModal?.camara ? dataModal.camara : null,
      camaraCategoria: dataModal?.camaraCategoria || null,
      antiguedad: dataModal.antiguedad ? dataModal.antiguedad : null,
      desde: desdeDayjs === 'Invalid Date' ? null : desdeDayjs,
      hasta: hastaDayjs === 'Invalid Date' ? null : hastaDayjs,
    };

    if (!aporteFinal.id) {
      console.log('alta');
      const data = await axiosAportes.crear(aporteFinal);
      if (data && data.id) {
        setRows((prevRows) => [data, ...prevRows]);
        setDataModal({
          id: null,
          entidad: null,
          aporte: null,
          socio: '',
          calculoTipo: '',
          calculoValor: 0,
          calculoBase: '',
          camara: '',
          camaraCategoria: '',
          antiguedad: '',
          desde: null,
          hasta: null,
        });
        handleClose();
      }
    } else {
      console.log('modificacion');
      const data = await axiosAportes.actualizar(aporteFinal);
      if (data) {
        const newRows = rows.map((row) =>
          row.id === aporteFinal.id ? aporteFinal : row,
        );
        setRows(newRows);
      }
    }
  };

  const columnas = [
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      flex: 1,
      cellClassName: 'actions',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'header--cell',
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          className="textPrimary"
          onClick={editarAporte(row)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          className="textPrimary"
          onClick={eliminarAportes(row)}
          color="inherit"
        />,
      ],
    },
    {
      field: 'entidad',
      headerName: 'Entidad',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'aporte',
      headerName: 'Aporte',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'socio',
      headerName: 'Socio',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        return value ? 'Si' : 'No';
      },
    },
    /* {
      field: 'nroCuenta',
      headerName: 'Número de Cuenta',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    }, */
    {
      field: 'calculoTipo',
      headerName: 'Cálculo Tipo',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'calculoValor',
      headerName: 'Cálculo Valor',
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        if (value === '') return '';
        if (value === null) return '';
        return formatter.currency.format(value || 0);
      },
    },
    {
      field: 'calculoBase',
      headerName: 'Cálculo Base',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'camara',
      headerName: 'Cámara',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'camaraCategoria',
      headerName: 'Categoría',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'antiguedad',
      headerName: 'Antigüedad',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
    },
    {
      field: 'desde',
      headerName: 'Desde',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        if (!value) return '';
        return dayjs(value).format('DD/MM/YYYY');
      },
    },
    {
      field: 'hasta',
      headerName: 'Hasta',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'header--cell',
      valueFormatter: ({ value }) => {
        if (!value) return '';
        return dayjs(value).format('DD/MM/YYYY');
      },
    },
  ];

  return (
    <Box className="aportes_container">
      <Typography variant="h2">Aportes</Typography>

      <Box
        sx={{
          height: '600px',
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <ThemeProvider theme={themeWithLocale}>
          <StripedDataGrid
            rows={rows}
            columns={columnas}
            getRowId={(row) => rows.indexOf(row)}
            getRowClassName={(params) =>
              rows.indexOf(params.row) % 2 === 0 ? 'even' : 'odd'
            }
            localeText={dataGridStyle.toolbarText}
            slots={{ toolbar: crearNuevoRegistro }}
            slotProps={{
              toolbar: {
                setRows,
                setRowModesModel,
                showQuickFilter: true,
                showColumnMenu: true,
                themeWithLocale,
                handleOpen,
                setPeticionTitulo,
              },
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 75, 100]}
          />
        </ThemeProvider>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              textAlign: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '5px',
              width: '400px',
              marginBottom: '20px',
              color: theme.palette.primary.main,
            }}
          >
            {peticionTitulo}
          </Typography>

          <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              <Grid item xs={4}>
                <Autocomplete
                  options={entidades}
                  getOptionLabel={(option) => option.codigo}
                  isOptionEqualToValue={(option, value) =>
                    option.codigo === value.codigo
                  }
                  value={dataModal.entidad}
                  onChange={(e, newValue) => {
                    handleChangeDataModal(newValue, 'entidad');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar por entidad"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  options={aportes}
                  getOptionLabel={(option) => option.descripcion}
                  isOptionEqualToValue={(option, value) =>
                    option.codigo === value.codigo
                  }
                  value={dataModal.aporte}
                  onChange={(e, newValue) => {
                    handleChangeDataModal(newValue, 'aporte');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar por aporte"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="socio-label">Socio</InputLabel>
                  <Select
                    labelId="socio-label"
                    id="socio"
                    value={dataModal.socio || ''}
                    onChange={(e) =>
                      handleChangeDataModal(e.target.value, 'socio')
                    }
                  >
                    <MenuItem value={true}>Si</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="calculoTipo-label">Cálculo Tipo</InputLabel>
                  <Select
                    labelId="calculoTipo-label"
                    id="calculoTipo"
                    value={dataModal.calculoTipo || ''}
                    onChange={(e) =>
                      handleChangeDataModal(e.target.value, 'calculoTipo')
                    }
                  >
                    {tipo.map((t) => (
                      <MenuItem key={t.codigo} value={t.codigo}>
                        {t.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <CurrencyInput
                  id="input-example"
                  className="aportes_currency"
                  name="input-name"
                  placeholder="Please enter a number"
                  defaultValue={dataModal.calculoValor || 0}
                  decimalsLimit={2}
                  onValueChange={(value, name, values) =>
                    handleChangeDataModal(value, 'calculoValor')
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="calculoBase-label">Cálculo Base</InputLabel>
                  <Select
                    labelId="calculoBase-label"
                    id="calculoBase"
                    value={dataModal.calculoBase || ''}
                    onChange={(e) =>
                      handleChangeDataModal(e.target.value, 'calculoBase')
                    }
                  >
                    {base.map((cb) => (
                      <MenuItem key={cb.codigo} value={cb.codigo}>
                        {cb.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: '12px' }}>
              <Grid item xs={4}>
                <FormControl fullWidth>
                  <InputLabel id="camara-label">Cámara</InputLabel>
                  <Select
                    labelId="camara-label"
                    id="camara"
                    value={dataModal.camara || ''}
                    onChange={(e) => {
                      handleChangeDataModal('', 'camaraCategoria');
                      handleChangeDataModal('', 'antiguedad');
                      handleChangeDataModal(e.target.value, 'camara');
                    }}
                  >
                    {camara.map((c) => (
                      <MenuItem key={c.codigo} value={c.codigo}>
                        {c.descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={4}>
                <Tooltip
                  title={!dataModal.camara ? 'Seleccione una cámara' : ''}
                >
                  <FormControl fullWidth>
                    <InputLabel id="camaraCategoria-label">
                      Categoría
                    </InputLabel>
                    <Select
                      defaultValue=""
                      labelId="camaraCategoria-label"
                      id="camaraCategoria"
                      value={
                        categoria.length > 0 ? dataModal.camaraCategoria : ''
                      }
                      onChange={(e) => {
                        handleChangeDataModal('', 'antiguedad');
                        handleChangeDataModal(
                          e.target.value,
                          'camaraCategoria',
                        );
                      }}
                      disabled={!dataModal.camara}
                    >
                      {categoria.map((c) => (
                        <MenuItem key={c.categoria} value={c.categoria}>
                          {c.categoria}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Tooltip>
              </Grid>
              <Grid item xs={4}>
                <Tooltip
                  title={
                    !dataModal.camaraCategoria ? 'Seleccione una categoría' : ''
                  }
                >
                  <FormControl fullWidth>
                    <InputLabel id="antiguedad-label">Antigüedad</InputLabel>
                    <Select
                      labelId="antiguedad-label"
                      id="antiguedad"
                      value={antiguedad.length > 0 ? dataModal.antiguedad : ''}
                      onChange={(e) =>
                        handleChangeDataModal(e.target.value, 'antiguedad')
                      }
                      disabled={!dataModal.camaraCategoria}
                    >
                      {antiguedad.map((a) => (
                        <MenuItem key={a.antDesde} value={a.antDesde}>
                          {a.antDesde}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              <Grid item xs={6}>
                <DemoContainer
                  components={['DatePicker']}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'end',
                  }}
                >
                  <DesktopDatePicker
                    label={'Desde'}
                    views={['day', 'month', 'year']}
                    closeOnSelect={true}
                    onChange={(date) => handleChangeDataModal(date, 'desde')}
                    value={dataModal.desde || null}
                    sx={{
                      width: '60%',
                    }}
                  />
                </DemoContainer>
              </Grid>
              <Grid item xs={6}>
                <DemoContainer
                  components={['DatePicker']}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                  }}
                >
                  <DesktopDatePicker
                    label={'Hasta'}
                    views={['day', 'month', 'year']}
                    closeOnSelect={true}
                    onChange={(date) => handleChangeDataModal(date, 'hasta')}
                    value={dataModal.hasta || null}
                    sx={{
                      width: '60%',
                    }}
                  />
                </DemoContainer>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              <Button
                variant="contained"
                sx={{ marginTop: '20px', width: '40%' }}
                onClick={cancelarEdicion}
              >
                cancelar
              </Button>

              <Button
                variant="contained"
                sx={{ marginTop: '20px', width: '40%' }}
                type="submit"
              >
                Enviar
              </Button>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  border: '2px solid #1A76D2',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};
